/* =========================================================
   CONFIGURAÇÃO DO NPC
========================================================= */

const NPC_IMAGE_SIZE = 120;

const CROP_PREVIEW_SIZE = 240;


/* =========================================================
   ESTADO DO RECORTE
========================================================= */

let npcCropState = {

    image: null,

    fileType: "",

    zoom: 1,

    offsetX: 0,

    offsetY: 0,

    dragging: false,

    dragStartX: 0,

    dragStartY: 0,

    originalOffsetX: 0,

    originalOffsetY: 0

};


/* =========================================================
   INICIALIZAÇÃO
========================================================= */

function initializeNpc() {

    const input =
        document.getElementById(
            "npc-image-input"
        );

    const overlay =
        document.getElementById(
            "npc-portrait-frame-overlay"
        );


    if (input) {

        input.addEventListener(
            "change",
            handleNpcImageSelection
        );

    }


    if (overlay) {

        overlay.addEventListener(
            "click",
            openNpcFileSelector
        );

    }


    renderNpcImage();

    renderNpcSettingsPreview();

}


/* =========================================================
   ABRIR SELETOR
========================================================= */

function openNpcFileSelector() {

    const input =
        document.getElementById(
            "npc-image-input"
        );


    if (!input) {
        return;
    }


    input.value = "";

    input.click();

}


/* =========================================================
   SELEÇÃO
========================================================= */

function handleNpcImageSelection(event) {

    const file =
        event.target.files &&
        event.target.files[0];


    if (!file) {
        return;
    }


    const allowedTypes = [

        "image/png",

        "image/jpeg",

        "image/jpg",

        "image/gif"

    ];


    if (
        !allowedTypes.includes(
            file.type
        )
    ) {

        alert(
            "Escolha uma imagem PNG, JPEG, JPG ou GIF."
        );

        return;

    }


    const reader =
        new FileReader();


    reader.onload =
        function () {

            const image =
                new Image();


            image.onload =
                function () {

                    npcCropState.image =
                        image;

                    npcCropState.fileType =
                        file.type;

                    npcCropState.zoom =
                        1;

                    npcCropState.offsetX =
                        0;

                    npcCropState.offsetY =
                        0;

                    openNpcCropModal();

                };


            image.src =
                reader.result;

        };


    reader.readAsDataURL(file);

}


/* =========================================================
   MODAL
========================================================= */

function openNpcCropModal() {

    closeNpcCropModal();


    const modal =
        document.createElement(
            "div"
        );


    modal.className =
        "npc-crop-modal";


    modal.id =
        "npc-crop-modal";


    modal.innerHTML = `

        <div class="npc-crop-modal-content">

            <h2 class="npc-crop-modal-title">
                Ajustar retrato do NPC
            </h2>

            <div class="npc-crop-canvas-wrapper">

                <canvas
                    id="npc-crop-canvas"
                    class="npc-crop-canvas"
                    width="240"
                    height="240"
                ></canvas>

            </div>

            <div class="npc-crop-controls">

                <label for="npc-crop-zoom">
                    Zoom
                </label>

                <input
                    type="range"
                    id="npc-crop-zoom"
                    min="1"
                    max="4"
                    step="0.01"
                    value="1"
                >

            </div>

            <div class="npc-crop-actions">

                <button
                    type="button"
                    class="secondary-button"
                    id="npc-crop-cancel"
                >
                    Cancelar
                </button>

                <button
                    type="button"
                    class="primary-button"
                    id="npc-crop-confirm"
                >
                    Confirmar
                </button>

            </div>

        </div>

    `;


    document.body.appendChild(
        modal
    );


    const canvas =
        document.getElementById(
            "npc-crop-canvas"
        );

    const zoom =
        document.getElementById(
            "npc-crop-zoom"
        );

    const cancel =
        document.getElementById(
            "npc-crop-cancel"
        );

    const confirm =
        document.getElementById(
            "npc-crop-confirm"
        );


    drawNpcCrop();


    zoom.addEventListener(
        "input",
        function () {

            npcCropState.zoom =
                Number(
                    zoom.value
                );

            drawNpcCrop();

        }
    );


    canvas.addEventListener(
        "mousedown",
        handleNpcCropMouseDown
    );


    canvas.addEventListener(
        "mousemove",
        handleNpcCropMouseMove
    );


    canvas.addEventListener(
        "mouseup",
        handleNpcCropMouseUp
    );


    canvas.addEventListener(
        "mouseleave",
        handleNpcCropMouseUp
    );


    canvas.addEventListener(
        "wheel",
        handleNpcCropWheel,
        {
            passive: false
        }
    );


    cancel.addEventListener(
        "click",
        closeNpcCropModal
    );


    confirm.addEventListener(
        "click",
        confirmNpcCrop
    );

}


/* =========================================================
   DRAG
========================================================= */

function handleNpcCropMouseDown(event) {

    npcCropState.dragging =
        true;

    npcCropState.dragStartX =
        event.clientX;

    npcCropState.dragStartY =
        event.clientY;

    npcCropState.originalOffsetX =
        npcCropState.offsetX;

    npcCropState.originalOffsetY =
        npcCropState.offsetY;


    const canvas =
        event.currentTarget;

    canvas.classList.add(
        "dragging"
    );

}


function handleNpcCropMouseMove(event) {

    if (
        !npcCropState.dragging
    ) {
        return;
    }


    const deltaX =
        event.clientX -
        npcCropState.dragStartX;


    const deltaY =
        event.clientY -
        npcCropState.dragStartY;


    npcCropState.offsetX =
        npcCropState.originalOffsetX +
        deltaX;


    npcCropState.offsetY =
        npcCropState.originalOffsetY +
        deltaY;


    drawNpcCrop();

}


function handleNpcCropMouseUp(event) {

    npcCropState.dragging =
        false;


    const canvas =
        event.currentTarget;


    if (canvas) {

        canvas.classList.remove(
            "dragging"
        );

    }

}


/* =========================================================
   ZOOM COM RODA
========================================================= */

function handleNpcCropWheel(event) {

    event.preventDefault();


    const direction =
        event.deltaY < 0
            ? 0.1
            : -0.1;


    npcCropState.zoom =
        clamp(
            npcCropState.zoom +
            direction,
            1,
            4
        );


    const zoom =
        document.getElementById(
            "npc-crop-zoom"
        );


    if (zoom) {

        zoom.value =
            npcCropState.zoom;

    }


    drawNpcCrop();

}


/* =========================================================
   DESENHAR
========================================================= */

function drawNpcCrop() {

    const canvas =
        document.getElementById(
            "npc-crop-canvas"
        );


    if (
        !canvas ||
        !npcCropState.image
    ) {
        return;
    }


    const context =
        canvas.getContext(
            "2d"
        );


    const image =
        npcCropState.image;


    context.clearRect(
        0,
        0,
        CROP_PREVIEW_SIZE,
        CROP_PREVIEW_SIZE
    );


    context.fillStyle =
        "#111";


    context.fillRect(
        0,
        0,
        CROP_PREVIEW_SIZE,
        CROP_PREVIEW_SIZE
    );


    const baseScale =
        Math.max(
            CROP_PREVIEW_SIZE /
                image.width,

            CROP_PREVIEW_SIZE /
                image.height
        );


    const scale =
        baseScale *
        npcCropState.zoom;


    const width =
        image.width *
        scale;


    const height =
        image.height *
        scale;


    const x =
        (
            CROP_PREVIEW_SIZE -
            width
        ) /
        2 +
        npcCropState.offsetX;


    const y =
        (
            CROP_PREVIEW_SIZE -
            height
        ) /
        2 +
        npcCropState.offsetY;


    context.imageSmoothingEnabled =
        true;


    context.drawImage(
        image,
        x,
        y,
        width,
        height
    );

}


/* =========================================================
   CONFIRMAR
========================================================= */

function confirmNpcCrop() {

    const canvas =
        document.createElement(
            "canvas"
        );


    canvas.width =
        NPC_IMAGE_SIZE;


    canvas.height =
        NPC_IMAGE_SIZE;


    const context =
        canvas.getContext(
            "2d"
        );


    const image =
        npcCropState.image;


    if (!image) {
        return;
    }


    const baseScale =
        Math.max(
            NPC_IMAGE_SIZE /
                image.width,

            NPC_IMAGE_SIZE /
                image.height
        );


    const scale =
        baseScale *
        npcCropState.zoom;


    const width =
        image.width *
        scale;


    const height =
        image.height *
        scale;


    const previewRatio =
        NPC_IMAGE_SIZE /
        CROP_PREVIEW_SIZE;


    const x =
        (
            NPC_IMAGE_SIZE -
            width
        ) /
        2 +
        npcCropState.offsetX *
        previewRatio;


    const y =
        (
            NPC_IMAGE_SIZE -
            height
        ) /
        2 +
        npcCropState.offsetY *
        previewRatio;


    context.clearRect(
        0,
        0,
        NPC_IMAGE_SIZE,
        NPC_IMAGE_SIZE
    );


    context.drawImage(
        image,
        x,
        y,
        width,
        height
    );


    const dataUrl =
        canvas.toDataURL(
            "image/png"
        );


    appData.config.npcImage =
        dataUrl;


    appData.config.npcImageZoom =
        npcCropState.zoom;


    appData.config.npcImagePositionX =
        npcCropState.offsetX;


    appData.config.npcImagePositionY =
        npcCropState.offsetY;


    saveData(
        appData
    );


    closeNpcCropModal();

    renderNpcImage();

    renderNpcSettingsPreview();

}


/* =========================================================
   RENDER NPC PRINCIPAL
========================================================= */

function renderNpcImage() {

    const frame =
        document.getElementById(
            "npc-portrait-frame"
        );


    if (!frame) {
        return;
    }


    const oldImage =
        frame.querySelector(
            ".npc-portrait-image"
        );


    if (oldImage) {

        oldImage.remove();

    }


    const placeholder =
        frame.querySelector(
            ".npc-portrait-placeholder"
        );


    if (
        !appData.config.npcImage
    ) {

        if (placeholder) {
            placeholder.style.display =
                "flex";
        }

        return;

    }


    if (placeholder) {

        placeholder.style.display =
            "none";

    }


    const image =
        document.createElement(
            "img"
        );


    image.className =
        "npc-portrait-image";


    image.src =
        appData.config.npcImage;


    image.alt =
        "Retrato do NPC";


    frame.appendChild(
        image
    );

}


/* =========================================================
   PREVIEW DAS CONFIGURAÇÕES
========================================================= */

function renderNpcSettingsPreview() {

    const preview =
        document.getElementById(
            "npc-settings-preview"
        );


    if (!preview) {
        return;
    }


    preview.innerHTML = "";


    const image =
        document.createElement(
            "img"
        );


    image.alt =
        "Pré-visualização do NPC";


    image.src =
        appData.config.npcImage ||
        NPC_DEFAULT_IMAGE;


    preview.appendChild(
        image
    );

}


/* =========================================================
   RESTAURAR
========================================================= */

function restoreDefaultNpcImage() {

    appData.config.npcImage =
        "";

    appData.config.npcImageZoom =
        1;

    appData.config.npcImagePositionX =
        50;

    appData.config.npcImagePositionY =
        50;


    saveData(
        appData
    );


    renderNpcImage();

    renderNpcSettingsPreview();

}


/* =========================================================
   FECHAR MODAL
========================================================= */

function closeNpcCropModal() {

    const modal =
        document.getElementById(
            "npc-crop-modal"
        );


    if (modal) {

        modal.remove();

    }

}


/* =========================================================
   UTILITÁRIO
========================================================= */

function clamp(
    value,
    minimum,
    maximum
) {

    return Math.min(
        Math.max(
            value,
            minimum
        ),
        maximum
    );

}