document.addEventListener(
    "DOMContentLoaded",
    initializeApp
);


/* =========================================================
   INICIALIZAÇÃO
========================================================= */

function initializeApp() {

    initializeNavigation();

    initializePurchaseForm();

    initializePurchaseFilters();

    initializePurchasePreview();

    initializeSalePreview();

    initializeImport();

    populateSelects();

    initializeDefaultValues();

    loadConfig();

    initializeNpc();

    renderPurchases();

    renderInventory();

    renderConverters();

    renderProductionHistory();

    renderConverterStock();

    renderSalesHistory();

    updateDashboard();

}


/* =========================================================
   NAVEGAÇÃO
========================================================= */

function initializeNavigation() {

    document
        .querySelectorAll(
            ".nav-button"
        )
        .forEach(
            function (button) {

                button.addEventListener(
                    "click",
                    function () {

                        openScreen(
                            button.dataset.screen
                        );

                    }
                );

            }
        );

}


function openScreen(
    screenName
) {

    document
        .querySelectorAll(
            ".screen"
        )
        .forEach(
            function (screen) {

                screen.classList.remove(
                    "active"
                );

            }
        );


    const screen =
        document.getElementById(
            "screen-" +
            screenName
        );


    if (screen) {

        screen.classList.add(
            "active"
        );

    }


    document
        .querySelectorAll(
            ".nav-button"
        )
        .forEach(
            function (button) {

                button.classList.toggle(
                    "active",
                    button.dataset.screen ===
                    screenName
                );

            }
        );

}


/* =========================================================
   DEFAULT
========================================================= */

function initializeDefaultValues() {

    const date =
        document.getElementById(
            "purchase-date"
        );


    if (
        date &&
        !date.value
    ) {

        date.value =
            getTodayDate();

    }

}


/* =========================================================
   COMPRAS
========================================================= */

function initializePurchaseForm() {

    const form =
        document.getElementById(
            "purchase-form"
        );


    if (!form) {
        return;
    }


    form.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();

            registerPurchase();

        }
    );

}


function initializePurchasePreview() {

    const quantity =
        document.getElementById(
            "purchase-quantity"
        );


    const price =
        document.getElementById(
            "purchase-unit-price"
        );


    if (quantity) {

        quantity.addEventListener(
            "input",
            updatePurchaseTotalPreview
        );

    }


    if (price) {

        price.addEventListener(
            "input",
            updatePurchaseTotalPreview
        );

    }


    updatePurchaseTotalPreview();

}


function updatePurchaseTotalPreview() {

    const quantity =
        Number(
            document.getElementById(
                "purchase-quantity"
            )?.value || 0
        );


    const price =
        Number(
            document.getElementById(
                "purchase-unit-price"
            )?.value || 0
        );


    setText(
        "purchase-total-preview",
        formatZeny(
            quantity *
            price
        )
    );

}
function initializeSalePreview() {

    const converter =
        document.getElementById(
            "sale-converter"
        );


    const quantity =
        document.getElementById(
            "sale-quantity"
        );


    const price =
        document.getElementById(
            "sale-price"
        );


    if (converter) {

        converter.addEventListener(
            "change",
            updateSalePreview
        );

    }


    if (quantity) {

        quantity.addEventListener(
            "input",
            updateSalePreview
        );

    }


    if (price) {

        price.addEventListener(
            "input",
            updateSalePreview
        );

    }


    updateSalePreview();

}


function updateSalePreview() {

    const converterId =
        document.getElementById(
            "sale-converter"
        )?.value || "";


    const quantity =
        Number(
            document.getElementById(
                "sale-quantity"
            )?.value || 0
        );


    const price =
        Number(
            document.getElementById(
                "sale-price"
            )?.value || 0
        );


    if (
        !converterId ||
        !Number.isFinite(quantity) ||
        quantity <= 0
    ) {

        setText(
            "sale-cost-preview",
            "0z"
        );


        setText(
            "sale-revenue-preview",
            "0z"
        );


        setText(
            "sale-profit-preview",
            "0z"
        );


        return;

    }


    const cost =
        calculateSaleCost(
            converterId,
            quantity
        );


    if (cost === null) {

        setText(
            "sale-cost-preview",
            "0z"
        );


        setText(
            "sale-revenue-preview",
            "0z"
        );


        setText(
            "sale-profit-preview",
            "0z"
        );


        return;

    }


    const revenue =
        quantity *
        (
            Number.isFinite(price)
                ? price
                : 0
        );


    const profit =
        revenue -
        cost;


    setText(
        "sale-cost-preview",
        formatZeny(
            cost
        )
    );


    setText(
        "sale-revenue-preview",
        formatZeny(
            revenue
        )
    );


    setText(
        "sale-profit-preview",
        formatZeny(
            profit
        )
    );

}

function registerPurchase() {

    const materialId =
        document.getElementById(
            "purchase-material"
        ).value;


    const quantity =
        Number(
            document.getElementById(
                "purchase-quantity"
            ).value
        );


    const unitPrice =
        Number(
            document.getElementById(
                "purchase-unit-price"
            ).value
        );


    const date =
        document.getElementById(
            "purchase-date"
        ).value;


    const note =
        document.getElementById(
            "purchase-note"
        ).value.trim();


    if (!materialId) {

        alert(
            "Selecione um material."
        );

        return;

    }


    if (
        !Number.isFinite(quantity) ||
        quantity <= 0
    ) {

        alert(
            "Informe uma quantidade válida."
        );

        return;

    }


    if (
        !Number.isFinite(unitPrice) ||
        unitPrice < 0
    ) {

        alert(
            "Informe um preço válido."
        );

        return;

    }


    if (!date) {

        alert(
            "Informe a data da compra."
        );

        return;

    }


    const material =
        MATERIALS.find(
            function (item) {

                return item.id ===
                    materialId;

            }
        );


    if (!material) {
        return;
    }


    appData.purchases.push({

        id:
            generateId(),

        materialId:
            material.id,

        materialName:
            material.name,

        quantity:
            quantity,

        unitPrice:
            unitPrice,

        total:
            quantity *
            unitPrice,

        date:
            date,

        note:
            note,

        createdAt:
            new Date().toISOString()

    });


    saveData(
        appData
    );


    document
        .getElementById(
            "purchase-form"
        )
        .reset();


    document.getElementById(
        "purchase-date"
    ).value =
        getTodayDate();


    updatePurchaseTotalPreview();

    renderPurchases();

    renderInventory();

    renderConverters();

    renderConverterStock();

    updateDashboard();

}


function initializePurchaseFilters() {

    const month =
        document.getElementById(
            "purchase-filter-month"
        );


    const material =
        document.getElementById(
            "purchase-filter-material"
        );


    const clear =
        document.getElementById(
            "clear-filters"
        );


    if (month) {

        month.addEventListener(
            "change",
            renderPurchases
        );

    }


    if (material) {

        material.addEventListener(
            "change",
            renderPurchases
        );

    }


    if (clear) {

        clear.addEventListener(
            "click",
            function () {

                if (month) {
                    month.value = "";
                }

                if (material) {
                    material.value = "";
                }

                renderPurchases();

            }
        );

    }

}


function getFilteredPurchases() {

    const month =
        document.getElementById(
            "purchase-filter-month"
        )?.value || "";


    const material =
        document.getElementById(
            "purchase-filter-material"
        )?.value || "";


    return appData.purchases
        .filter(
            function (purchase) {

                if (
                    month &&
                    !purchase.date.startsWith(
                        month
                    )
                ) {

                    return false;

                }


                if (
                    material &&
                    purchase.materialId !==
                    material
                ) {

                    return false;

                }


                return true;

            }
        )
        .sort(
            function (a, b) {

                return (
                    b.date.localeCompare(
                        a.date
                    ) ||
                    String(b.id).localeCompare(
                        String(a.id)
                    )
                );

            }
        );

}


function renderPurchases() {

    const purchases =
        getFilteredPurchases();


    const table =
        document.getElementById(
            "purchase-table"
        );


    if (!table) {
        return;
    }


    if (!purchases.length) {

        table.innerHTML = `

            <tr>

                <td
                    colspan="7"
                    class="empty-state"
                >
                    Nenhuma compra encontrada.
                </td>

            </tr>

        `;

    } else {

        table.innerHTML =
            purchases
                .map(
                    function (purchase) {

                        return `

                            <tr>

                                <td>
                                    ${formatDate(
                                        purchase.date
                                    )}
                                </td>

                                <td>
                                    ${escapeHtml(
                                        purchase.materialName
                                    )}
                                </td>

                                <td>
                                    ${formatNumber(
                                        purchase.quantity
                                    )}
                                </td>

                                <td>
                                    ${formatZeny(
                                        purchase.unitPrice
                                    )}
                                </td>

                                <td>
                                    ${formatZeny(
                                        purchase.total
                                    )}
                                </td>

                                <td>
                                    ${
                                        purchase.note
                                            ? escapeHtml(
                                                purchase.note
                                            )
                                            : "-"
                                    }
                                </td>

                                <td>

                                    <button
                                        type="button"
                                        class="table-action-button"
                                        onclick="deletePurchase('${purchase.id}')"
                                    >
                                        Excluir
                                    </button>

                                </td>

                            </tr>

                        `;

                    }
                )
                .join("");

    }


    updatePurchaseSummary(
        purchases
    );

}


function updatePurchaseSummary(
    purchases
) {

    const quantity =
        purchases.reduce(
            function (total, purchase) {

                return total +
                    Number(
                        purchase.quantity
                    );

            },
            0
        );


    const spent =
        purchases.reduce(
            function (total, purchase) {

                return total +
                    Number(
                        purchase.total ||
                        (
                            purchase.quantity *
                            purchase.unitPrice
                        )
                    );

            },
            0
        );


    const prices =
        purchases
            .map(
                function (purchase) {

                    return Number(
                        purchase.unitPrice
                    );

                }
            )
            .filter(
                Number.isFinite
            );


    const average =
        quantity > 0
            ? spent / quantity
            : 0;


    setText(
        "summary-purchases",
        formatNumber(
            purchases.length
        )
    );


    setText(
        "summary-quantity",
        formatNumber(
            quantity
        )
    );


    setText(
        "summary-spent",
        formatZeny(
            spent
        )
    );


    setText(
        "summary-average",
        prices.length
            ? formatZeny(
                average
            )
            : "0z"
    );


    setText(
        "summary-min",
        prices.length
            ? formatZeny(
                Math.min(
                    ...prices
                )
            )
            : "-"
    );


    setText(
        "summary-max",
        prices.length
            ? formatZeny(
                Math.max(
                    ...prices
                )
            )
            : "-"
    );

}


function deletePurchase(
    id
) {

    const purchase =
        appData.purchases.find(
            function (item) {

                return String(item.id) ===
                    String(id);

            }
        );


    if (!purchase) {
        return;
    }


    if (
        !confirm(
            "Excluir esta compra?"
        )
    ) {

        return;

    }


    appData.purchases =
        appData.purchases.filter(
            function (item) {

                return String(item.id) !==
                    String(id);

            }
        );


    saveData(
        appData
    );


    renderPurchases();

    renderInventory();

    renderConverters();

    renderConverterStock();

    updateDashboard();

}


/* =========================================================
   ESTOQUE DE MATERIAIS
========================================================= */

function calculateStock() {

    return MATERIALS.map(
        function (material) {

            const purchases =
                appData.purchases.filter(
                    function (purchase) {

                        return purchase.materialId ===
                            material.id;

                    }
                );


            const purchasedQuantity =
                purchases.reduce(
                    function (total, purchase) {

                        return total +
                            Number(
                                purchase.quantity
                            );

                    },
                    0
                );


            const totalSpent =
                purchases.reduce(
                    function (total, purchase) {

                        return total +
                            Number(
                                purchase.total ||
                                (
                                    purchase.quantity *
                                    purchase.unitPrice
                                )
                            );

                    },
                    0
                );


            const producedQuantity =
                appData.production
                    .filter(
                        function (production) {

                            return production.materialId ===
                                material.id;

                        }
                    )
                    .reduce(
                        function (total, production) {

                            return total +
                                Number(
                                    production.quantity
                                );

                        },
                        0
                    );


            const averagePrice =
                purchasedQuantity > 0
                    ? totalSpent /
                        purchasedQuantity
                    : 0;


            return {

                ...material,

                purchasedQuantity:
                    purchasedQuantity,

                producedQuantity:
                    producedQuantity,

                quantity:
                    purchasedQuantity -
                    producedQuantity,

                totalSpent:
                    totalSpent,

                averagePrice:
                    averagePrice

            };

        }
    );

}


function renderInventory() {

    const grid =
        document.getElementById(
            "inventory-grid"
        );


    if (!grid) {
        return;
    }


    const inventory =
        calculateStock();


    grid.innerHTML =
        inventory
            .map(
                function (item) {

                    const low =
                        item.quantity <=
                        item.minimumStock;


                    return `

                        <div class="inventory-card">

                            <div class="inventory-item-icon">

                                <img
                                    src="${item.sprite}"
                                    alt="${escapeHtml(
                                        item.name
                                    )}"
                                >

                            </div>

                            <div>

                                <h3 class="inventory-item-name">
                                    ${escapeHtml(
                                        item.name
                                    )}
                                </h3>

                                <div class="inventory-item-element">
                                    ${escapeHtml(
                                        item.element
                                    )}
                                </div>


                                <div class="inventory-item-data">

                                    <div class="inventory-data-box">

                                        <span>
                                            Estoque
                                        </span>

                                        <strong>
                                            ${formatNumber(
                                                item.quantity
                                            )}
                                        </strong>

                                    </div>


                                    <div class="inventory-data-box">

                                        <span>
                                            Comprado
                                        </span>

                                        <strong>
                                            ${formatNumber(
                                                item.purchasedQuantity
                                            )}
                                        </strong>

                                    </div>


                                    <div class="inventory-data-box">

                                        <span>
                                            Médio
                                        </span>

                                        <strong>
                                            ${formatZeny(
                                                item.averagePrice
                                            )}
                                        </strong>

                                    </div>

                                </div>

                            </div>


                            <div
                                class="inventory-status ${
                                    low
                                        ? "low"
                                        : ""
                                }"
                            >
                                ${
                                    low
                                        ? "Estoque baixo"
                                        : "Estoque normal"
                                }
                            </div>

                        </div>

                    `;

                }
            )
            .join("");

}


/* =========================================================
   CONVERSORES
========================================================= */

function calculateConverterCost(
    converter
) {

    const inventory =
        calculateStock();


    const material =
        inventory.find(
            function (item) {

                return item.id ===
                    converter.material;

            }
        );


    const materialCost =
        material
            ? material.averagePrice
            : 0;


    const scrollPrice =
        Number(
            appData.config.blankScrollPrice ||
            BLANK_SCROLL.price
        );


    return (
        materialCost +
        scrollPrice
    );

}


function renderConverters() {

    const grid =
        document.getElementById(
            "converter-grid"
        );


    if (!grid) {
        return;
    }


    const inventory =
        calculateStock();


    grid.innerHTML =
        CONVERTERS
            .map(
                function (converter) {

                    const material =
                        inventory.find(
                            function (item) {

                                return item.id ===
                                    converter.material;

                            }
                        );


                    const unitCost =
                        calculateConverterCost(
                            converter
                        );


                    const stock =
                        material
                            ? material.quantity
                            : 0;


                    return `

                        <div class="converter-card">

                            <div class="converter-sprite-box">

    <img
        class="converter-sprite"
        src="${converter.sprite}"
        alt="${escapeHtml(
            converter.name
        )}"
    >

</div>


                            <div>

                                <div class="converter-header">

                                    <div class="converter-name">
                                        ${escapeHtml(
                                            converter.name
                                        )}
                                    </div>

                                    <div class="converter-element">
                                        ${escapeHtml(
                                            converter.element
                                        )}
                                    </div>

                                </div>


                                <div class="converter-material">

                                    <div class="converter-material-label">
                                        Material necessário
                                    </div>

                                    <div class="converter-material-name">
                                        ${escapeHtml(
                                            converter.materialName
                                        )}
                                    </div>

                                    <div class="converter-material-stock">
                                        Estoque disponível:
                                        ${formatNumber(
                                            stock
                                        )}
                                    </div>

                                </div>


                                <div class="converter-stats">

                                    <div class="converter-stat">

                                        <span class="converter-stat-label">
                                            Material
                                        </span>

                                        <span class="converter-stat-value">
                                            ${formatZeny(
                                                material
                                                    ? material.averagePrice
                                                    : 0
                                            )}
                                        </span>

                                    </div>


                                    <div class="converter-stat">

                                        <span class="converter-stat-label">
                                            Pergaminho
                                        </span>

                                        <span class="converter-stat-value">
                                            ${formatZeny(
                                                appData.config.blankScrollPrice
                                            )}
                                        </span>

                                    </div>


                                    <div class="converter-stat">

                                        <span class="converter-stat-label">
                                            Custo unit.
                                        </span>

                                        <span
                                            id="converter-unit-cost-${converter.id}"
                                            class="converter-stat-value"
                                        >
                                            ${formatZeny(
                                                unitCost
                                            )}
                                        </span>

                                    </div>

                                </div>


                                <div class="converter-form">

                                    <div class="converter-field">

                                        <label>
                                            Quantidade
                                        </label>

                                        <input
                                            type="number"
                                            min="1"
                                            step="1"
                                            id="converter-quantity-${converter.id}"
                                            value="1"
                                            oninput="updateConverterCalculation('${converter.id}')"
                                        >

                                    </div>



                                    <button
                                        type="button"
                                        class="primary-button converter-production-button"
                                        onclick="registerProduction('${converter.id}')"
                                    >
                                        Produzir
                                    </button>

                                </div>


                                    <div class="converter-results">

                                        <div class="converter-result">

                                            Custo do lote:
                                            <strong id="converter-batch-cost-${converter.id}">
                                                0z
                                            </strong>

                                        </div>

                                    </div>

                                    </div>

                                    </div>

                                    `;

                }
            )
            .join("");


    CONVERTERS.forEach(
        function (converter) {

            updateConverterCalculation(
                converter.id
            );

        }
    );

}


function updateConverterCalculation(
    converterId
) {

    const converter =
        CONVERTERS.find(
            function (item) {

                return item.id ===
                    converterId;

            }
        );


    if (!converter) {
        return;
    }


    const quantity =
        Number(
            document.getElementById(
                `converter-quantity-${converterId}`
            )?.value || 0
        );


    const unitCost =
        calculateConverterCost(
            converter
        );


    const batchCost =
        unitCost *
        quantity;


    setText(
        `converter-unit-cost-${converterId}`,
        formatZeny(
            unitCost
        )
    );


    setText(
        `converter-batch-cost-${converterId}`,
        formatZeny(
            batchCost
        )
    );

}


function registerProduction(
    converterId
) {

    const converter =
        CONVERTERS.find(
            function (item) {

                return item.id ===
                    converterId;

            }
        );


    if (!converter) {
        return;
    }


    const quantity =
        Number(
            document.getElementById(
                `converter-quantity-${converterId}`
            )?.value || 0
        );


    if (
        !Number.isFinite(quantity) ||
        quantity <= 0
    ) {

        alert(
            "Informe uma quantidade válida."
        );

        return;

    }


    const inventory =
        calculateStock();


    const material =
        inventory.find(
            function (item) {

                return item.id ===
                    converter.material;

            }
        );


    if (
        !material ||
        material.quantity < quantity
    ) {

        alert(
            `Estoque insuficiente de ${converter.materialName}.`
        );

        return;

    }


    const unitCost =
        calculateConverterCost(
            converter
        );


    appData.production.push({

        id:
            generateId(),

        converterId:
            converter.id,

        converterName:
            converter.name,

        materialId:
            converter.material,

        materialName:
            converter.materialName,

        quantity:
            quantity,

        unitCost:
            unitCost,

        batchCost:
            unitCost *
            quantity,



        date:
            getTodayDate(),

        createdAt:
            new Date().toISOString()

    });


    saveData(
        appData
    );


    renderConverters();

    renderInventory();

    renderProductionHistory();

    renderConverterStock();

    updateDashboard();

}


/* =========================================================
   HISTÓRICO DE PRODUÇÃO
========================================================= */

function getSoldQuantityFromProduction(
    productionId
) {

    return appData.sales
        .filter(
            function (sale) {

                return sale.productionId ===
                    productionId;

            }
        )
        .reduce(
            function (total, sale) {

                return total +
                    Number(
                        sale.quantity
                    );

            },
            0
        );

}


function renderProductionHistory() {

    const table =
        document.getElementById(
            "production-table"
        );


    if (!table) {
        return;
    }


    if (
        !appData.production.length
    ) {

        table.innerHTML = `

            <tr>

                <td
                    colspan="5"
                    class="empty-state"
                >
                    Nenhuma produção registrada.
                </td>

            </tr>

        `;

        return;

    }


    table.innerHTML =
        [...appData.production]
            .reverse()
            .map(
                function (production) {

                    const sold =
                        getSoldQuantityFromProduction(
                            production.id
                        );


                    const remaining =
                        production.quantity -
                        sold;


                    const action =
                        remaining ===
                        production.quantity

                            ? `

                                <button
                                    type="button"
                                    class="table-action-button"
                                    onclick="deleteProduction('${production.id}')"
                                >
                                    Excluir
                                </button>

                              `

                            : `

                                <span>
                                    ${formatNumber(
                                        remaining
                                    )} restante
                                </span>

                              `;


                    return `

                        <tr>

                            <td>
                                ${formatDate(
                                    production.date
                                )}
                            </td>

                            <td>
                                ${escapeHtml(
                                    production.converterName
                                )}
                            </td>

                            <td>
                                ${formatNumber(
                                    production.quantity
                                )}
                            </td>

                            <td>
                                ${formatZeny(
                                    production.batchCost
                                )}
                            </td>

                            <td>
                                ${action}
                            </td>

                        </tr>

                    `;

                }
            )
            .join("");

}


function deleteProduction(
    productionId
) {

    const production =
        appData.production.find(
            function (item) {

                return String(item.id) ===
                    String(productionId);

            }
        );


    if (!production) {
        return;
    }


    const sold =
        getSoldQuantityFromProduction(
            productionId
        );


    if (sold > 0) {

        alert(
            "Esta produção já possui vendas e não pode ser excluída."
        );

        return;

    }


    if (
        !confirm(
            "Excluir esta produção e devolver o material ao estoque?"
        )
    ) {

        return;

    }


    appData.production =
        appData.production.filter(
            function (item) {

                return String(item.id) !==
                    String(productionId);

            }
        );


    saveData(
        appData
    );


    renderConverters();

    renderInventory();

    renderProductionHistory();

    renderConverterStock();

    updateDashboard();

}


/* =========================================================
   ESTOQUE DE CONVERSORES
========================================================= */

function calculateConverterStock() {

    return CONVERTERS.map(
        function (converter) {

            const produced =
                appData.production
                    .filter(
                        function (production) {

                            return production.converterId ===
                                converter.id;

                        }
                    )
                    .reduce(
                        function (total, production) {

                            return total +
                                Number(
                                    production.quantity
                                );

                        },
                        0
                    );


            const sold =
                appData.sales
                    .filter(
                        function (sale) {

                            return sale.converterId ===
                                converter.id;

                        }
                    )
                    .reduce(
                        function (total, sale) {

                            return total +
                                Number(
                                    sale.quantity
                                );

                        },
                        0
                    );


            return {

                ...converter,

                produced:
                    produced,

                sold:
                    sold,

                available:
                    produced -
                    sold

            };

        }
    );

}


function renderConverterStock() {

    const grid =
        document.getElementById(
            "converter-stock-grid"
        );


    if (!grid) {
        return;
    }


    grid.innerHTML =
        calculateConverterStock()
            .map(
                function (converter) {

                    return `

                        <div class="converter-stock-card">

                            <div class="converter-stock-card-name">
                                ${escapeHtml(
                                    converter.name
                                )}
                            </div>

                            <div class="converter-stock-card-value">
                                ${formatNumber(
                                    converter.available
                                )}
                            </div>

                            <div class="converter-stock-card-info">

                                Produzidos:
                                ${formatNumber(
                                    converter.produced
                                )}

                                <br>

                                Vendidos:
                                ${formatNumber(
                                    converter.sold
                                )}

                            </div>

                        </div>

                    `;

                }
            )
            .join("");

}


/* =========================================================
   VENDAS
========================================================= */

function registerSaleFromForm() {

    const converterId =
        document.getElementById(
            "sale-converter"
        ).value;


    const quantity =
        document.getElementById(
            "sale-quantity"
        ).value;


    const price =
        document.getElementById(
            "sale-price"
        ).value;


    registerSale(
        converterId,
        quantity,
        price
    );

}


function getAvailableProductionLots(
    converterId
) {

    const productions =
        appData.production
            .filter(
                function (production) {

                    return production.converterId ===
                        converterId;

                }
            )
            .sort(
                function (a, b) {

                    return (
                        String(a.date).localeCompare(
                            String(b.date)
                        )
                    );

                }
            );


    return productions
        .map(
            function (production) {

                const sold =
                    getSoldQuantityFromProduction(
                        production.id
                    );


                return {

                    production:
                        production,

                    remaining:
                        production.quantity -
                        sold

                };

            }
        )
        .filter(
            function (lot) {

                return lot.remaining > 0;

            }
        );

}


function calculateSaleCost(
    converterId,
    quantity
) {

    let remaining =
        quantity;


    let cost =
        0;


    const lots =
        getAvailableProductionLots(
            converterId
        );


    for (
        const lot of lots
    ) {

        if (
            remaining <= 0
        ) {
            break;
        }


        const used =
            Math.min(
                remaining,
                lot.remaining
            );


        cost +=
            used *
            Number(
                lot.production.unitCost
            );


        remaining -=
            used;

    }


    if (
        remaining > 0
    ) {

        return null;

    }


    return cost;

}


function registerSale(
    converterId,
    quantityValue,
    priceValue
) {

    const quantity =
        Number(
            quantityValue
        );


    const price =
        Number(
            priceValue
        );


    if (!converterId) {

        alert(
            "Selecione um conversor."
        );

        return;

    }


    if (
        !Number.isFinite(quantity) ||
        quantity <= 0
    ) {

        alert(
            "Informe uma quantidade válida."
        );

        return;

    }


    if (
        !Number.isFinite(price) ||
        price < 0
    ) {

        alert(
            "Informe um preço válido."
        );

        return;

    }


    const stock =
        calculateConverterStock()
            .find(
                function (converter) {

                    return converter.id ===
                        converterId;

                }
            );


    if (
        !stock ||
        stock.available < quantity
    ) {

        alert(
            "Estoque de conversores insuficiente."
        );

        return;

    }


    const cost =
        calculateSaleCost(
            converterId,
            quantity
        );


    if (cost === null) {

        alert(
            "Não foi possível calcular o custo da venda."
        );

        return;

    }


    const converter =
        CONVERTERS.find(
            function (item) {

                return item.id ===
                    converterId;

            }
        );


    if (!converter) {
        return;
    }


    appData.sales.push({

        id:
            generateId(),

        converterId:
            converterId,

        converterName:
            converter.name,

        quantity:
            quantity,

        unitPrice:
            price,

        revenue:
            quantity *
            price,

        cost:
            cost,

        profit:
            (
                quantity *
                price
            ) -
            cost,

        date:
            getTodayDate(),

        createdAt:
            new Date().toISOString()

    });


    saveData(
        appData
    );


    document.getElementById(
        "sale-quantity"
    ).value = "";


    document.getElementById(
        "sale-price"
    ).value = "";


    updateSalePreview();


    renderConverterStock();

    renderSalesHistory();

    renderProductionHistory();

    updateDashboard();

}


function renderSalesHistory() {

    const table =
        document.getElementById(
            "sales-table"
        );


    if (!table) {
        return;
    }


    if (
        !appData.sales.length
    ) {

        table.innerHTML = `

            <tr>

                <td
                    colspan="8"
                    class="empty-state"
                >
                    Nenhuma venda registrada.
                </td>

            </tr>

        `;

        return;

    }


    table.innerHTML =
        [...appData.sales]
            .reverse()
            .map(
                function (sale) {

                    return `

                        <tr>

                            <td>
                                ${formatDate(
                                    sale.date
                                )}
                            </td>

                            <td>
                                ${escapeHtml(
                                    sale.converterName
                                )}
                            </td>

                            <td>
                                ${formatNumber(
                                    sale.quantity
                                )}
                            </td>

                            <td>
                                ${formatZeny(
                                    sale.cost
                                )}
                            </td>

                            <td>
                                ${formatZeny(
                                    sale.revenue
                                )}
                            </td>

                            <td>
                                ${formatZeny(
                                    sale.profit
                                )}
                            </td>

                            <td>
                                ${formatZeny(
                                    sale.unitPrice
                                )}
                            </td>

                            <td>

                                <button
                                    type="button"
                                    class="table-action-button"
                                    onclick="deleteSale('${sale.id}')"
                                >
                                    Excluir
                                </button>

                            </td>

                        </tr>

                    `;

                }
            )
            .join("");

}


function deleteSale(
    saleId
) {

    const sale =
        appData.sales.find(
            function (item) {

                return String(item.id) ===
                    String(saleId);

            }
        );


    if (!sale) {
        return;
    }


    if (
        !confirm(
            "Excluir esta venda?"
        )
    ) {

        return;

    }


    appData.sales =
        appData.sales.filter(
            function (item) {

                return String(item.id) !==
                    String(saleId);

            }
        );


    saveData(
        appData
    );


    renderConverterStock();

    renderSalesHistory();

    renderProductionHistory();

    updateDashboard();

}


/* =========================================================
   SELECTS
========================================================= */

function populateSelects() {

    const purchaseMaterial =
        document.getElementById(
            "purchase-material"
        );


    const purchaseFilter =
        document.getElementById(
            "purchase-filter-material"
        );


    const saleConverter =
        document.getElementById(
            "sale-converter"
        );


    if (purchaseMaterial) {

        purchaseMaterial.innerHTML = `

            <option value="">
                Selecione um material
            </option>

            ${
                MATERIALS
                    .map(
                        function (material) {

                            return `

                                <option value="${material.id}">
                                    ${escapeHtml(
                                        material.name
                                    )}
                                </option>

                            `;

                        }
                    )
                    .join("")
            }

        `;

    }


    if (purchaseFilter) {

        purchaseFilter.innerHTML = `

            <option value="">
                Todos os materiais
            </option>

            ${
                MATERIALS
                    .map(
                        function (material) {

                            return `

                                <option value="${material.id}">
                                    ${escapeHtml(
                                        material.name
                                    )}
                                </option>

                            `;

                        }
                    )
                    .join("")
            }

        `;

    }


    if (saleConverter) {

        saleConverter.innerHTML = `

            <option value="">
                Selecione o conversor
            </option>

            ${
                CONVERTERS
                    .map(
                        function (converter) {

                            return `

                                <option value="${converter.id}">
                                    ${escapeHtml(
                                        converter.name
                                    )}
                                </option>

                            `;

                        }
                    )
                    .join("")
            }

        `;

    }

}


/* =========================================================
   CONFIGURAÇÕES
========================================================= */

function loadConfig() {

    const character =
        document.getElementById(
            "config-character-name"
        );


    const server =
        document.getElementById(
            "config-server"
        );


    const scroll =
        document.getElementById(
            "config-scroll-price"
        );


    if (character) {

        character.value =
            appData.config.characterName ||
            "";

    }


    if (server) {

        server.value =
            appData.config.server ||
            "LATAM";

    }


    if (scroll) {

        scroll.value =
            Number(
                appData.config.blankScrollPrice ||
                4000
            );

    }

}


function saveConfig() {

    const character =
        document.getElementById(
            "config-character-name"
        );


    const server =
        document.getElementById(
            "config-server"
        );


    const scroll =
        document.getElementById(
            "config-scroll-price"
        );


    appData.config.characterName =
        character
            ? character.value.trim()
            : "";


    appData.config.server =
        server
            ? server.value.trim() ||
                "LATAM"
            : "LATAM";


    appData.config.blankScrollPrice =
        scroll
            ? Number(
                scroll.value
            ) || 0
            : 4000;


    saveData(
        appData
    );


    renderConverters();


    alert(
        "Configurações salvas."
    );

}


/* =========================================================
   IMPORTAR DADOS
========================================================= */

function initializeImport() {

    const input =
        document.getElementById(
            "import-data-input"
        );


    if (!input) {
        return;
    }


    input.addEventListener(
        "change",
        handleImportFile
    );

}


function openImportSelector() {

    const input =
        document.getElementById(
            "import-data-input"
        );


    if (input) {

        input.click();

    }

}


function handleImportFile(
    event
) {

    const file =
        event.target.files &&
        event.target.files[0];


    if (!file) {
        return;
    }


    const reader =
        new FileReader();


    reader.onload =
        function () {

            try {

                const imported =
                    JSON.parse(
                        reader.result
                    );


                if (
                    !imported ||
                    typeof imported !==
                    "object"
                ) {

                    throw new Error(
                        "Formato inválido."
                    );

                }


                if (
                    !Array.isArray(
                        imported.purchases
                    ) ||
                    !Array.isArray(
                        imported.production
                    ) ||
                    !Array.isArray(
                        imported.sales
                    )
                ) {

                    throw new Error(
                        "Arquivo de dados incompatível."
                    );

                }


                if (
                    !confirm(
                        "Importar estes dados substituirá os dados atuais. Continuar?"
                    )
                ) {

                    return;

                }


                appData = {

                    ...getDefaultData(),

                    ...imported,

                    config: {

                        ...DEFAULT_CONFIG,

                        ...(imported.config || {})

                    }

                };


                saveData(
                    appData
                );


                populateSelects();

                loadConfig();

                renderPurchases();

                renderInventory();

                renderConverters();

                renderProductionHistory();

                renderConverterStock();

                renderSalesHistory();

                updateDashboard();

                renderNpcImage();

                renderNpcSettingsPreview();


                alert(
                    "Dados importados com sucesso."
                );

            } catch (error) {

                console.error(
                    error
                );


                alert(
                    "Não foi possível importar este arquivo."
                );

            }

        };


    reader.readAsText(
        file
    );


    event.target.value = "";

}


/* =========================================================
   EXPORTAR DADOS
========================================================= */

function exportData() {

    const exportObject = {

        app:
            "Ragnarok Converter Manager",

        version:
            1,

        exportedAt:
            new Date().toISOString(),

        purchases:
            appData.purchases,

        production:
            appData.production,

        sales:
            appData.sales,

        config:
            appData.config

    };


    const json =
        JSON.stringify(
            exportObject,
            null,
            4
        );


    const blob =
        new Blob(
            [json],
            {
                type:
                    "application/json"
            }
        );


    const url =
        URL.createObjectURL(
            blob
        );


    const link =
        document.createElement(
            "a"
        );


    const date =
        getTodayDate();


    link.href =
        url;


    link.download =
        `ragnarok-converter-backup-${date}.json`;


    document.body.appendChild(
        link
    );


    link.click();


    link.remove();


    URL.revokeObjectURL(
        url
    );

}


/* =========================================================
   DASHBOARD
========================================================= */

function updateDashboard() {

    const inventory =
        calculateStock();


    const converterStock =
        calculateConverterStock();


    const materialStock =
        inventory.reduce(
            function (total, item) {

                return total +
                    Math.max(
                        0,
                        Number(
                            item.quantity
                        )
                    );

            },
            0
        );


    const totalPurchases =
        appData.purchases.reduce(
            function (total, purchase) {

                return total +
                    Number(
                        purchase.total ||
                        (
                            purchase.quantity *
                            purchase.unitPrice
                        )
                    );

            },
            0
        );


    const converterQuantity =
        converterStock.reduce(
            function (total, converter) {

                return total +
                    Math.max(
                        0,
                        converter.available
                    );

            },
            0
        );


    const revenue =
        appData.sales.reduce(
            function (total, sale) {

                return total +
                    Number(
                        sale.revenue
                    );

            },
            0
        );


    const profit =
        appData.sales.reduce(
            function (total, sale) {

                return total +
                    Number(
                        sale.profit
                    );

            },
            0
        );


    setText(
        "dashboard-material-stock",
        formatNumber(
            materialStock
        )
    );


    setText(
        "dashboard-total-purchases",
        formatZeny(
            totalPurchases
        )
    );


    setText(
        "dashboard-purchases",
        formatNumber(
            appData.purchases.length
        )
    );


    setText(
        "dashboard-converter-stock",
        formatNumber(
            converterQuantity
        )
    );


    setText(
        "dashboard-realized-revenue",
        formatZeny(
            revenue
        )
    );


    setText(
        "dashboard-realized-profit",
        formatZeny(
            profit
        )
    );

}


/* =========================================================
   HELPERS
========================================================= */

function getTodayDate() {

    const today =
        new Date();


    const year =
        today.getFullYear();


    const month =
        String(
            today.getMonth() + 1
        ).padStart(
            2,
            "0"
        );


    const day =
        String(
            today.getDate()
        ).padStart(
            2,
            "0"
        );


    return (
        year +
        "-" +
        month +
        "-" +
        day
    );

}


function generateId() {

    return (
        Date.now().toString(36) +
        "-" +
        Math.random()
            .toString(36)
            .slice(2, 9)
    );

}


function formatNumber(
    value
) {

    return Number(
        value || 0
    ).toLocaleString(
        "pt-BR"
    );

}


function formatZeny(
    value
) {

    const number =
        Number(
            value || 0
        );


    return (
        number.toLocaleString(
            "pt-BR",
            {
                minimumFractionDigits:
                    number % 1 !== 0
                        ? 2
                        : 0,

                maximumFractionDigits:
                    2
            }
        ) +
        "z"
    );

}


function formatDate(
    date
) {

    if (!date) {
        return "-";
    }


    const parts =
        String(
            date
        ).split(
            "-"
        );


    if (
        parts.length !== 3
    ) {

        return date;

    }


    return (
        parts[2] +
        "/" +
        parts[1] +
        "/" +
        parts[0]
    );

}


function setText(
    id,
    value
) {

    const element =
        document.getElementById(
            id
        );


    if (element) {

        element.textContent =
            value;

    }

}


function escapeHtml(
    value
) {

    return String(
        value ?? ""
    )
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );

}