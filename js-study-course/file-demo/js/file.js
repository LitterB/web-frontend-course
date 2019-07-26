function checkBrowserSupport() {
    if (!(window.File && window.FileReader && window.FileList && window.Blob)) {
        throw new Error("当前浏览器对file api支持不完善");
    }
}

function handleFileSelect(event) {
    const {files} = event.target;
    if ( !files.length ) {
        console.log("没有选择文件");
        return;
    }

    const innerHtml = [];
    const reImage = /image.*/;
    let vm = document.createDocumentFragment(),
        imageLoaded = 0,
        imageTotal = 0;

    for ( let file of files ) {
        if (!reImage.test(file.type)) {
            continue;
        }
        imageTotal++;
        innerHtml.push(
            `
           <li>
                <strong>${file.name}</strong>
                (${file.type || "n/a"}) - ${file.size} bytes
            </li>
            `
        );
    }

    const handleLoadStart = (ev, file) => {
        console.log(`>>>Start load ${file.name}`);
    }

    const handleOnload = (ev, file) => {
        console.log(`<<< End load ${file.name}`);
        const img = document.createElement("img");
        img.height = 250;
        img.width = 250;
        img.src = ev.target.result;
        vm.appendChild(img);
        if (++imageLoaded === imageTotal) {
            document.querySelector("#images").appendChild(vm);
        }
    };

    for ( let file of files ) {
        const reader = new FileReader();
        reader.onloadstart = ev => handleLoadStart(ev, file);
        reader.onload = ev => handleOnload(ev, file);
        reader.readAsDataURL(file);
    }


    document.querySelector("#list").innerHTML = `<ul>${innerHtml.join("")}</ul>`
}
