/* =========================================================
   CAMINHOS
========================================================= */

const ITEM_SPRITE_PATH =
    "assets/items";

const NPC_DEFAULT_IMAGE =
    "assets/vendor/npc-default.png";


/* =========================================================
   MATERIAIS
   ORDEM ALFABÉTICA
========================================================= */

const MATERIALS = [

    {
        id: "cristal-azul",
        name: "Cristal Azul",
        itemId: 991,
        element: "Água",
        sprite: `${ITEM_SPRITE_PATH}/991.png`,
        minimumStock: 300
    },

    {
        id: "frescor-vento",
        name: "Frescor do Vento",
        itemId: 992,
        element: "Vento",
        sprite: `${ITEM_SPRITE_PATH}/992.png`,
        minimumStock: 300
    },

    {
        id: "sangue-escarlate",
        name: "Sangue Escarlate",
        itemId: 990,
        element: "Fogo",
        sprite: `${ITEM_SPRITE_PATH}/990.png`,
        minimumStock: 300
    },

    {
        id: "vida-verdejante",
        name: "Vida Verdejante",
        itemId: 993,
        element: "Terra",
        sprite: `${ITEM_SPRITE_PATH}/993.png`,
        minimumStock: 300
    }

];


/* =========================================================
   PERGAMINHO
========================================================= */

const BLANK_SCROLL = {

    id: "pergaminho-em-branco",

    name: "Pergaminho em Branco",

    itemId: 7433,

    sprite:
        `${ITEM_SPRITE_PATH}/7433.png`,

    price: 4000

};


/* =========================================================
   CONVERSORES
========================================================= */

const CONVERTERS = [

    {
        id: "agua",

        name: "Conversor de Água",

        itemId: 12115,

        element: "ÁGUA",

        sprite:
            `${ITEM_SPRITE_PATH}/12115.png`,

        material: "cristal-azul",

        materialName: "Cristal Azul"
    },

    {
        id: "fogo",

        name: "Conversor de Fogo",

        itemId: 12114,

        element: "FOGO",

        sprite:
            `${ITEM_SPRITE_PATH}/12114.png`,

        material: "sangue-escarlate",

        materialName: "Sangue Escarlate"
    },

    {
        id: "terra",

        name: "Conversor de Terra",

        itemId: 12116,

        element: "TERRA",

        sprite:
            `${ITEM_SPRITE_PATH}/12116.png`,

        material: "vida-verdejante",

        materialName: "Vida Verdejante"
    },

    {
        id: "vento",

        name: "Conversor de Vento",

        itemId: 12117,

        element: "VENTO",

        sprite:
            `${ITEM_SPRITE_PATH}/12117.png`,

        material: "frescor-vento",

        materialName: "Frescor do Vento"
    }

];


/* =========================================================
   CONFIGURAÇÃO PADRÃO
========================================================= */

const DEFAULT_CONFIG = {

    characterName: "",

    server: "LATAM",

    blankScrollPrice: 4000,

    npcImage: "",

    npcImageZoom: 1,

    npcImagePositionX: 50,

    npcImagePositionY: 50

};