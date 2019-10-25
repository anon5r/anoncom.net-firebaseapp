window.addEventListener("DOMContentLoaded",()=>{
    const mimeSelect=document.getElementById("select-mime-type");
    const textFilename = document.getElementById('text-filename');
    const labelExtension=document.getElementById("label-extension");
    const textContent=document.getElementById('blob-content');
    const checkBase64=document.getElementById('chk-base64');
    const checkDataUri=document.getElementById('chk-with-data-uri');
    let mimeOptions;
    let loadedContent,loadedFilename,loadedMimeType;

    import('/scripts/blobDL/modules/mime-type.mjs').then(module => {
        let mimeType = module.mimeType;
        mimeSelect.removeChild(mimeSelect.querySelector("option"));
        let opt=document.createElement('option');
        opt.innerText="選択して下さい";
        opt.value='';
        mimeSelect.appendChild(opt);

        for (let i in mimeType) {
            let opt = document.createElement('option');
            opt.value=mimeType[i].type;
            opt.innerText = mimeType[i].title + ' ('+mimeType[i].type+')';
            opt.dataset.ext = mimeType[i].extension;
            mimeSelect.appendChild(opt);
        }
        mimeOptions = mimeSelect.querySelectorAll("option");
    });

    mimeSelect.addEventListener("change",function(e){
        labelExtension.innerText=mimeSelect[this.selectedIndex].dataset.ext;
    });

    document.getElementById('btn-download').addEventListener('click',function(e){
        let content = textContent.value;
        let isBase64 = checkBase64.checked;
        let isDataURI = checkDataUri.checked;
        let filename = 'unknown';
        let textExtension = document.getElementById('label-extension').innerText;
        let mimeOptions = document.querySelectorAll('#'+mimeSelect.id+' option');
        if (textFilename.value.length > 1)
            filename = textFilename.value;
        if (textExtension.length > 1)
            filename += textExtension;
        else
            filename += '.bin';
        let mimeTypeString = 'application/octet-stream';
        if (typeof mimeSelect[mimeSelect.selectedIndex] !== 'undefined' && mimeSelect[mimeSelect.selectedIndex].value!=='')
            mimeTypeString = mimeOptions[mimeSelect.selectedIndex].value;
        let blob;
        if (isBase64) {
            // @see https://qiita.com/uin010bm/items/150003f016287750cf34
            let bin = atob(content.replace(/^.*,/, ''));
            let buff = new Uint8Array(bin.length);
            for (let i = 0; i < bin.length; i++) {
                buff[i] = bin.charCodeAt(i);
            }
            blob = new Blob([buff.buffer], {type: mimeTypeString});

        } else
            blob = new Blob([content], {type: mimeTypeString});

        if (typeof window.navigator.msSaveBlob === 'function')
            window.navigator.msSaveBlob(blob,filename);
        else {
            this.setAttribute('download',filename);
            this.href = window.URL.createObjectURL(blob);
        }
    });

    // samples
    let samples = document.getElementsByClassName('link-sample-data');
    for (let idx in samples) {
        let elem = samples[idx];
        if (typeof elem !== 'object') continue;
        elem.addEventListener('click',(e)=>{
            e.preventDefault();
            import('/scripts/blobDL/modules/sample_data.mjs').then(data => {
                let sample = data.sample[elem.dataset.type];
                loadedContent = sample.content;
                textFilename.value = sample.filename;
                if (checkDataUri.checked)
                    textContent.value = 'data:' + sample.type + ';base64,' + loadedContent;
                else
                    textContent.value = loadedContent;
                for (let i in mimeOptions) {
                    if (mimeOptions[i].value === sample.type) {
                        mimeSelect.selectedIndex = i;
                        labelExtension.innerText = mimeOptions[i].dataset.ext;
                        break;
                    }
                }
            });
        });
    };
    document.getElementById('btn-file').addEventListener('click', async ()=>{
        const file = await openFileDialog();
        const content = await readAsText(file);
        loadedContent = content;
        if (checkDataUri.checked) {
            textContent.value = 'data:' + file.type + ';base64,' + content;
            textContent.innerText = 'data:' + file.type + ';base64,' + content;
        } else {
            textContent.value = content;
            textContent.innerText = content;
        }
    });
    checkDataUri.addEventListener('change',function(e){
        if (this.checked) {
            textContent.value = 'data:' + loadedMimeType + ';base64,' + loadedContent;
        } else {
            textContent.value = loadedContent;
        }
    })
    const openFileDialog = () => {
        return new Promise(resolve => {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'text/*,image/png,image/jpeg,image/gif,image/webp,image/svg+xml,audio/mp3,audio/aac,audio/aacp,audio/wave,audio/mp4,audio/3gpp,audio/3gpp2';
            input.onchange = e => {
                let file;
                if (e.target == null && typeof e.path[0].files[0] !== 'undefined')
                    file = e.path[0].files[0];
                else
                    file = e.target.files[0];
                resolve(file);
            };
            input.click();
        });
    };

    const readAsText = file => {
        return new Promise(resolve => {
            const reader = new FileReader();
            if (checkBase64.checked)
                reader.readAsDataURL(file);
            else
                reader.readAsText(file);
            reader.onload = () => {
                let result = reader.result;
                if (result.startsWith('data:')) {
                    result = result.substr(result.indexOf(';base64,')+8);
                }
                resolve(result);
                loadedFilename = file.name.substring(0,file.name.lastIndexOf('.'));
                loadedMimeType = file.type;
                labelExtension.innerText = file.name.substring(file.name.lastIndexOf('.'));
                textFilename.value = loadedFilename;
                for (let i in mimeOptions) {
                    if (mimeOptions[i].value === file.type) {
                        mimeSelect.selectedIndex = i;
                        break;
                    }
                }
            };
        });
    };
});