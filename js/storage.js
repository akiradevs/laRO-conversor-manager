/* =========================================================
   STORAGE
========================================================= */

const STORAGE_KEY =
    "ragnarokConverterManager";


/* =========================================================
   DADOS PADRÃO
========================================================= */

function getDefaultData() {

    return {

        purchases: [],

        production: [],

        sales: [],

        config: {
            ...DEFAULT_CONFIG
        }

    };

}


/* =========================================================
   CARREGAR
========================================================= */

function loadData() {

    const savedData =
        localStorage.getItem(
            STORAGE_KEY
        );


    if (!savedData) {

        return getDefaultData();

    }


    try {

        const data =
            JSON.parse(
                savedData
            );


        return {

            ...getDefaultData(),

            ...data,

            purchases:
                Array.isArray(
                    data.purchases
                )
                    ? data.purchases
                    : [],

            production:
                Array.isArray(
                    data.production
                )
                    ? data.production
                    : [],

            sales:
                Array.isArray(
                    data.sales
                )
                    ? data.sales
                    : [],

            config: {

                ...DEFAULT_CONFIG,

                ...(data.config || {})

            }

        };

    } catch (error) {

        console.error(
            "Erro ao carregar dados:",
            error
        );

        return getDefaultData();

    }

}


/* =========================================================
   SALVAR
========================================================= */

function saveData(data) {

    localStorage.setItem(

        STORAGE_KEY,

        JSON.stringify(data)

    );

}


/* =========================================================
   ESTADO GLOBAL
========================================================= */

let appData =
    loadData();