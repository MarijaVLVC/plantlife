$(document).ready(function () {

    

    /* ============ FUNCTION FOR AJAX ============ */

/*function callAjax(url, customFunction) {

$.ajax({

    url: url,

    method: 'POST',

    dataType: 'json',

    success: function(data) {

        customFunction(data)

    }, error: function(xhr, status, error){

        console.log(error);

    }

    });

}

*/

function ajaxCallbackWithUrl(url, callbackSuccess){ 

    $.ajax({

        url: url,

        method: "GET",

        success: callbackSuccess,

        error: function(xhr, status, error){

            console.log(error);

        }

    });

}



/* ========== Getting the page ========== */



var getPage = document.URL.split("/");

var pageName = getPage[getPage.length - 1];

var pageNameEmpty = getPage[getPage.length - 2];



if(document.URL == "http://vulovic.rs/plantlife/") {

    location.replace("http://vulovic.rs/plantlife/index.html")   

}



if((pageName == 'index.html') ) {

    // CALLING FUNCTION FOR 



}  else if (pageName.indexOf('shop.html') != -1) {



}  else if(pageName != 'index.html') {



   

}    







 /* ============ MODUO FOR PRODUCTS  ============ */

function Products() {

    let products = [];





    

    function productQuickViewGallery(product) {

        let quickView = "";

        product.forEach(function(prod, index) {

            index == 0 ? quickView += `<img id="imgID${prod.id}" src="${prod.imagePath}" class="activeImg"/>` : quickView += `<img id="imgID${prod.id}" src="${prod.imagePath}" />`

        });

        return quickView;

    }

    

    /* Inserting radio buttons for gallery in QuickView */

    

    function productQuickViewGalleryRadio(product) {

        var radioBtn = '';

       for(let i = 1; i < product.length; i++) {

            product.forEach(function(prod, index) {

                index == 0 ? radioBtn += `<li>

                    <a href="#" data-imgId="imgID${prod.id}" class="activeRadio">${prod.id}</a>

                        </li>` : radioBtn += `<li>

                    <a href="#" data-imgId="imgID${prod.id}">${prod.id}</a>

                    </li>`

            });

       }

       return radioBtn;

       

    }



    function sortByProductNameDecs() {

        products = products.sort((a,b) => {

            return a.productName - b.productName

        })

        populateHtml()

    }



    function sortByProductNameAsc() {

        products = products.sort((a,b) => {

            return b.productName - a.productName

        })

        populateHtml()

    }



/* Search Product By Name */



function seachByName() 

    {

         // Getting users search parametars

         var seachParametar = $(this).val();

        



         const filterBySearchParam = products.filter(search => {

             if(search.productName.toLowerCase().indexOf(seachParametar.toLowerCase()) !== -1) 

             {

                 return true;

             }

         });

         populateHtmlWithDifferentData(filterBySearchParam);

         //Calling the function to write a message if there are no products

         noProductsMessage(filterBySearchParam, seachParametar,  'name')

    }







/* Get Products  */

function getProductsForIndex() {

    ajaxCallbackWithUrl("/plantlife/data/products.json", function(data) {

        products = data

            productsOnSale()

            productsTop()

            //moduleLocalStorage

    })

}

    function getProducts() {

        ajaxCallbackWithUrl( "../data/products.json", function(data) {

            products = data

            populateHtml()

            getMaxPriceFromProducts()

            pagination()

        })

    }



   

/* Writting in HTML Products  */

    function populateHtml() {

        let html = ""



        for(let product of products) 

        {

            html += showProduct(product)

        }





        $(".shopBody-body").html(html)



        /* Calling functions */

        $('.quickView').click(productQuickView);

        $('#filterSearch').keyup(seachByName);

        $('#filterPrice').change(filterByPrice);

        $('#sortProducts').change(sortByAzZaPriceLowHigh);

        

        

    }

    function sortByAzZaPriceLowHigh() {

        $('#sortProducts').change(function() {

            var getSelectedOption = $(this).val();

            if(getSelectedOption == 'az') {

                sortIt('productName', 1, -1);

            }

            if(getSelectedOption == 'za') {

                sortIt('productName', -1, 1);

            }

            if(getSelectedOption == 'priceHighLow') {

                sortIt("price.oldPrice", -1, 1);

            }

            if(getSelectedOption == 'priceLowHigh') {

                sortIt("price.oldPrice", 1, -1);

            }

        });

        

    }

    /* Funchion for sorting which accepts 4 parametars: data, which object, and 2 parametars for sorting by */

    function sortIt(which, param1, param2) {

    

        products.sort((sortA, sortZ) => {

            /*Checking to see if there are subitems in an property */

            if(which.indexOf('.') !== -1 ) {

                var whichSplitObj = which.split('.');

                var whichObj = whichSplitObj[0];

                var whichSub = whichSplitObj[1];

    

                if(sortA[whichObj][whichSub] == sortZ[whichObj][whichSub]){

                    return 0;

                    }

                    else {

                    return sortA[whichObj][whichSub] > sortZ[whichObj][whichSub] ? param1 : param2;

                }

            } else {

                /* SOrting dirrectly by given name of an property */

            if(sortA[which] == sortZ[which]){

                return 0;

                }

                else {

                return sortA[which] > sortZ[which] ? param1 : param2;

                }

            }

               

    });

    

    populateHtml()

    }









    function filterByPrice() {



            // Getting the value choosen

            var rangePrice = $('#filterPrice').val();

    

            //setting Max attribute based on products higest price

            

            // Writting in HTML selected value

            $('#chosenPrice').html("form 0 to " + rangePrice);

           

    

            var priceChosenArray = products.filter(price => {

                return (price.price.oldPrice <= rangePrice);

                

            });

          

        populateHtmlWithDifferentData(priceChosenArray);

        sortIt("price.oldPrice", 1, -1);

       

    }

    

    function getMaxPriceFromProducts() {



        /* Sorted products by Max value of price */

        var max = products.sort((max1, max2)=>{

            if(max1.price.oldPrice == max2.price.oldPrice){

                return 0;

                }

                else {

                return max1.price.oldPrice > max2.price.oldPrice ? -1 : 1;

                }

        });

        /* Got the first element of the array products which is the one with highest price */

            for(let i = 0; i < max.length; i++) {

                if(i == 0) {

                    /* Set the higest value */

                    var maxValue = max[i].price.oldPrice;

                    /* Add it to html, and its value and its max value */

                    $("#filterPrice-end").html(maxValue);

                    $("#filterPrice").attr('max', maxValue)

                    $("#filterPrice").attr('value', maxValue)

                } 

            }

        }



    /*

    

        function getMaxPriceFromProducts(howMuchProduct, byWhat, returnAsValueOrObj) {

        var max;

        var maxValue = [];



        if(byWhat.indexOf('.') !== -1 ) {



            var byWhatObj = byWhat.split('.');

            var byWhat1 = byWhatObj[0];

            var byWhat2 = byWhatObj[1];



max = products.sort((max1, max2)=>{

                

    

    if(max1[byWhat1][byWhat2] == max2[byWhat1][byWhat2]){

        return 0;

        }

        else {

        

        return max1[byWhat1][byWhat2] > max2[byWhat1][byWhat2] ? -1 : 1;

        }

    });



    for(let i = 0; i < max.length; i++) {

        

        if((i <= howMuchProduct) && (returnAsValueOrObj == true)) {

             maxValue += max[i][byWhat1][byWhat2];

            } 

        }

    } else {

        

    var byWhat = byWhat;



    max = products.sort((max1, max2)=>{

    

        if(max1[byWhat] == max2[byWhat]){

            return 0;

            }

            else {

            return max1[byWhat] > max2[byWhat] ? -1 : 1;

            }

    });



   

    for(let i = 0; i < max.length; i++) {



    if((i <= howMuchProduct) && (returnAsValueOrObj == false)) {

        maxValue.push(max[i]);

         }

    }



            if(pageName.indexOf('shop.html') != -1 ) {

                $("#filterPrice-end").html(maxValue);

                $("#filterPrice").attr('max', maxValue);

                $("#filterPrice").attr('value', maxValue);

            } else if(pageName.indexOf('index.html') != -1) {

                let top5Products = getMaxPriceFromProducts(4, "productRating", false)



                console.log(top5Products);

    

                let productSale = '<div class="sliderBody">';

                top5Products.forEach(top5 => {

                  

                        productSale += top5;

                });

                productSale += `<div class="arrowControlsProduct">

                <a href="" class="leftArrowProduct"></a>

                <a href="" class="rightArrowProduct"></a>

                    </div>`;

                $('#productsTop5Slider').html(productSale);

                }



}

}

    

    */



 /* ===== PAGINATION ======= */

 



 function pagination(){



    // Getting the products

    var brPrikazaPoStranici = 6;



    insertPaginationLinks(brPrikazaPoStranici);

    $("#pagination li a").click(getActivePaginationLink);

    

 }



 function insertPaginationLinks(brPrikazaPoStranici) {



    pagination = "";

        var showNumbProductsAtATime = Math.ceil((products.length) / brPrikazaPoStranici);

          // Showing number of pages based on number of products that is going to be shown

            for(let j = 0; j < showNumbProductsAtATime; j++) {

                pagination += `<li><a href='#' data-numberShown='${((j + 1)*brPrikazaPoStranici)}'>${(j + 1)}</a></li>`;

            }



        $("#pagination").html(pagination);

        $("#pagination li a:first-of-type").attr('class', 'activePagination')

       

     

}





function paginationFunctionality(brPrikazaPoStranici, paginationPage) {



var productsHtml = "";

    if(paginationPage <= brPrikazaPoStranici) {

        for(let index = 0; index < paginationPage; index++ ) {

            productsHtml += `

                <!-- Product -->

                <article class="productSingle" data-category="${getCategories(products[index].category)}">

                    <img src="${products[index].productImage}" alt="${products[index].productName}">

                    <h3>${products[index].productName}</h3>

                    <div class="price">

                        <span class="newPrice">${products[index].price.oldPrice}$</span>

                    </div>

                    <!-- On hover, show -->

                    <div class="overlayWhite">

                        <a class="quickView btnBorderDark" href="#" data-id="${products[index].id}">Quick View</a>

                    </div>

                </article>

                <!-- End of Product -->

             `;

            }

        } else {

            for(let index = (paginationPage - brPrikazaPoStranici); index < paginationPage + brPrikazaPoStranici; index++ ) {

                if(products[index] != undefined){

                productsHtml += `

                <!-- Product -->

                <article class="productSingle" data-category="${getCategories(products[index].category)}">

                    <img src="${products[index].productImage}" alt="${products[index].productName}">

                    <h3>${products[index].productName}</h3>

                    <div class="price">

                        <span class="newPrice">${products[index].price.oldPrice}$</span>

                    </div>

                    <!-- On hover, show -->

                    <div class="overlayWhite">

                        <a class="quickView btnBorderDark" href="#" data-id="${products[index].id}">Quick View</a>

                    </div>

                </article>

                <!-- End of Product -->

             `;

            }

        }

            }



        $(".shopBody-body").html(productsHtml);

        

}





function getActivePaginationLink(brPrikazaPoStranici) {

        

        var paginationPage = $(this).data('numbershown');

        



        if( $("#pagination li a").attr('class', 'activePagination')) {

            $("#pagination li a").removeClass('activePagination');

            $(this).addClass('activePagination');

        } else {

            $(this).removeClass('activePagination');

        }



        paginationFunctionality(brPrikazaPoStranici, paginationPage);



}



    /* Writting in HTML Products with different arrays - FILTER */

    function populateHtmlWithDifferentData(filter) {

        let html = ""



        for(let product of filter) 

        {

            html += showProduct(product)

        }



        $(".shopBody-body").html(html)

        $('.quickView').click(productQuickView);

    }



    function showProduct(product) {

        return `<!-- Product -->

        <article class="productSingle" data-category="${getCategories(product.category)}">

            <img src="${product.productImage}" alt="${product.productName}">

            <h3>${product.productName}</h3>

            <div class="price">

                <span class="newPrice">${product.price.oldPrice}$</span>

            </div>

            <!-- On hover, show -->

            <div class="overlayWhite">

                <a class="quickView btnBorderDark" data-id="${product.id}">Quick View</a>

            </div>

        </article>

        <!-- End of Product -->`

    }





    function getCategories(product) {

        let categoryInHtml = '';

       for(let category in product) {

            categoryInHtml += category.categoryName;

        }

        return categoryInHtml;

    }







    function productQuickView() {

        /*var urlJquery = $(location).attr('href').split('?');

        var gettingClickedQuickView = urlJquery[1];*/



    

        var gettingClickedQuickView = $(this).data('id');

        var quickView = "";



        products.forEach(product => {

        if(gettingClickedQuickView  == product.id) {

            $('#showModal').css('display','block');

            quickView += quickViewProduct(product)

        }

    });



        $("#aboutProduct-body").html(quickView);



        $("#radioButtons li a").click(sliderImageWithRadio);

        $('#quantityBtns a').click(changeQuantity);

        

       

$('#productQuickView .btnDark').click(moduleLocalStorage.addToShoppingBag);

    }





    function quickViewProduct(product) {

   

            return `

                <!--  Gallery with radio buttons -->

            <div class="section50" id="galleryImageRadio">

            <div class="galleryImageRadio">

            <div class="images">

            ${productQuickViewGallery(product.productGallery)}

            </div>

            <div class="radioBtns">

            <ul id="radioButtons">

                ${productQuickViewGalleryRadio(product.productGallery)}

            </ul>

            </div>

            </div>



            </div>



            <!--  Details about product -->

            <div id="productQuickView" class="section50">

                    <h2>${product.productName}</h2>

                    <span class="newPrice">${product.price.oldPrice}$</span>

                    <p>${product.productDescription}</p>



                <div id="quantaty" class="section100flex">

                    <div class="section50 quaText">

                        Quantity

                    </div>

                    <div class="section50flex" id="quantityBtns">

                            <div class="section15" ><a id="quantatyBtnPlus">+</a></div>

                            <div class="section20" id="quantatyNumber">1</div>

                            <div class="section15" ><a id="quantatyBtnMinuse">-</a></div>

                    </div>

                </div>



            <div class="btnLinks">

                        <a href="" class="btnDark" data-id="${product.id}">Add to bag</a>

                        <!--<a href="" class="btnLinkWithIcon" data-id="${product.id}"><div class="gift-bag"></div> Send as a gif</a>-->

                </div>

            `;

    }



        /* Inserting images for gallery in QuickView */



        function productQuickViewGallery(product) {

            let quickView = "";

            product.forEach(function(prod, index) {

                index == 0 ? quickView += `<img id="imgID${prod.id}" src="${prod.imagePath}" class="activeImg"/>` : quickView += `<img id="imgID${prod.id}" src="${prod.imagePath}" />`

            });

            return quickView;

        }



        /* Inserting radio buttons for gallery in QuickView */



        function productQuickViewGalleryRadio(product) {

            var radioBtn = '';

        for(let i = 1; i < product.length; i++) {

                product.forEach(function(prod, index) {

                    index == 0 ? radioBtn += `<li>

                        <a href="#" data-imgId="imgID${prod.id}" class="activeRadio">${prod.id}</a>

                            </li>` : radioBtn += `<li>

                        <a href="#" data-imgId="imgID${prod.id}">${prod.id}</a>

                        </li>`

                });

        }

        return radioBtn;

        

        }



/* ========== SLider with Radio Btns ============ */



function sliderImageWithRadio() {



        // Getting clicked radios ID

        var currentActive = $(this).data('imgid');

    

         // Getting currently active Image ID - set as first visible

        var currentImgActive =  $("#galleryImageRadio .images img.activeImg").attr('id');

    

        // Getting all of the image and their id atributes

        var allImgaes =  $("#galleryImageRadio .images img");

    

        for(var img of allImgaes) {

            var imgMatchIdWithRadio = img.getAttribute('id');

        

           // Checking which radio data-imgId is matched with id of an Image

            if(currentActive == imgMatchIdWithRadio) {

                // Get the matched ImageId with radios ID

                var matchedImgId = currentActive;

    

                // Remove active classes for previously active image and radio

                $("#galleryImageRadio .images img.activeImg").removeClass('activeImg');

                $('.radioBtns ul li a.activeRadio').removeClass('activeRadio');

    

                // Set active class to the currently active Image and Radio 

                $("#galleryImageRadio .images img#" + matchedImgId).addClass('activeImg');

                $(this).addClass('activeRadio');

               

            } 

    

        }

    }



/* ===== QUANTITY ======= */

    

var quantityNumber = 1;

function changeQuantity(){

    // Setting quantity to default value



        //Get the clicked button

        var clickedOn = $(this).attr('id');



        // Setting the adding or subtracking depend on which button was clicked



            if(clickedOn == "quantatyBtnPlus") {

                if(quantityNumber != 20) {

                    quantityNumber += 1;

                }

            } else if (clickedOn == "quantatyBtnMinuse") {

                if(quantityNumber != 1) {

                    quantityNumber -= 1;

                }

            }

            $('#quantatyNumber').html(quantityNumber);





            return quantityNumber;

}





    

        /* ===== SHOW LIST OR GRID VIEW PRODUCTS ======= */

    

        $('#productsView li a').click(changeProductViewToListOrGrid);

    

        function changeProductViewToListOrGrid(e){

                //Get the clicked button

                var clickedOn = $(this).attr('id');

    

                // Setting the adding or subtracking depend on which button was clicked

                    e.preventDefault(); 

    

                    if(clickedOn == "productsGrid") {

                        $('.shopBody-body').removeClass("ShowInARow");

                        $('.shopBody-body').addClass("ShowInAGrid");

                    } else if (clickedOn == "productsList") {

                        $('.shopBody-body').removeClass("ShowInAGrid");

                        $('.shopBody-body').addClass("ShowInARow");

                    }

        }

        

        

         

        /* Showing Product basec on clicked Link from Navigation - CATEGORY */



        function productsOnSale() {

            let productSale = '<div class="sliderBody">';

            products.forEach(sale => {

                if(sale.price.newPrice > 0) {

                    productSale += insertProductInSlide(sale, 'sale');

                }

            });

            productSale += `<div class="arrowControlsProduct">

            <a href="" class="leftArrowProduct"></a>

            <a href="" class="rightArrowProduct"></a>

                </div>`;

            $('#productsSaleSlider').html(productSale);

            sliderMultipleItems();



            $("#productsSale article .btnBorderDark").click(function(){

                moduleLocalStorage.addToShoppingBag

            });

        }



        function productsTop() {

            let productSale = '<div class="sliderBody">';

            products.forEach(top => {

                if(top.productRating == 5) {

                    productSale += insertProductInSlide(top, 'top5');

                }

            });

            productSale += `<div class="arrowControlsProduct">

            <a href="" class="leftArrowProduct"></a>

            <a href="" class="rightArrowProduct"></a>

                </div>`;

            $('#productsTop5Slider').html(productSale);

            $("#productsTop5 article .btnBorderDark").click(moduleLocalStorage.addToShoppingBag);

        }



/* Separete funnction for inserting data into slider */

        function insertProductInSlide(sale, whichSlider){

           return  `

                    <div class="sliderItem">

                    <article class="productSingle" >

                        <img src="${indexImagePath(sale.productImage)}" alt="${sale.productName}"/>

                        <h3>${sale.productName}</h3>

                       ${saleOrTopProducts(sale, whichSlider)}  

                        <a class="btnBorderDark" data-id="${sale.id}">Buy</a>

                    </article>

                </div>

                    `;

        }

function indexImagePath(sale) {

    var splitByImage = sale.split("../");

    var indexImagePaths = splitByImage[1];

    return indexImagePaths;

} 

function saleOrTopProducts(sale, whichSlider) {

    var productSale = '';

    if(whichSlider == 'sale') {

        productSale += `<div class="price">

                        <span class="oldPrice">${sale.price.oldPrice}$</span>

                        <span class="newPrice">${sale.price.newPrice}$</span>

                    </div>`;

    } else if(whichSlider == 'top5') {

        productSale += `<div class="price">

                            <span class="newPrice">${sale.price.oldPrice}$</span>

                        </div>

                        <div class="productRating">

                        <ul>

                            ${productRatingInHTML(sale.productRating)}

                            

                        </ul>

                        </div> `;

    }

    return productSale;

}



/* Rating STARS */

     function productRatingInHTML(sale) {

        let productSale = '';

        for (let i = 1; i <= 5; i++) {

            if(i <= sale) {

                productSale += `

                <li class="fullStar"></li>`;

            } else {

                productSale += `

                <li class="emptyStar"></li>`;

            }

           

     }  

     return productSale;

    } 

/*------- PRODUCT SLIDER ------ */

 

function sliderMultipleItems() {

    var show = 3;

    var w = $('.sliderProduct').width() / show; //width of main div splited on a number of items defined to show

    var l = $('.sliderItem').length;//number of sliderItems - array

    

    $('.sliderItem').width(w); //width of a sliderItem set to width of main div splited on a number of items defined to show

    $('.sliderBody').width(w * l) //Calculating width for container of slide items ( width of main div splited on a number of items defined to show *  )

    

    /* Main Slide function that gets called for click on next and previous buttons

    param is send from functions for previous and next buttons 

    */

    function slider(param) {

        $(param).animate({

            marginLeft: - w

        }, 'slow', function () {

            // Conditions for knowing witch button was clicked on based on which will be used diferent methods; 

            // for arrowRightProduct is used appendTo()l for arrowLeftProduct was used prependTo()

           if(param == '.sliderItem:first-child') {

            $(this).appendTo($(this).parent()).css({marginLeft: 0});

           } else if (param == '.sliderItem:last-child') {

            $(this).prependTo($(this).parent()).animate({

                marginLeft: 0

            });

           }

           

        });

    }

    

    /* Buttons for next and previous */

    $('.rightArrowProduct').click(function(e){

        e.preventDefault();

     slider('.sliderItem:first-child');

    });

    $('.leftArrowProduct').click(function(e){

    e.preventDefault();

    slider('.sliderItem:last-child');

    

    });

    

    /* Stopping auto on hover event */

    var timer;

    $('.sliderProduct').hover(function(){

        clearInterval(timer);

    }, function(){

        timer = setInterval(slider('.sliderItem:first-child'), 2000);

    });

    

}





 /* ============ FILTER BY MULTIPLE CATEGORIES ============ */

function onFilterByCategory(){

    let checkedChbs = $('.size-element:checked') 



    let checkedSizes = [];

    for(let x of checkedChbs){

        checkedSizes.push(x.value);

    }



    // GET THE DATA ABOUT THE PRODUCTS

    ajaxCallbackWithUrl("../data/products.json", function(products){

        if(checkedSizes.length>0){

            products = filterByCategory(products, checkedSizes);

        } 

        // iNSERT INTO HTML

        populateHtmlWithDifferentData(products);



        // WRITE USER THE MESSAGE IF THERE ARE NO PRODUCTS

        noProductsMessage(products, writeValuesWithSeparator(checkedSizes), 'category')   

        productQuickView()

    })

}

 

function filterByCategory(products, checkedSizes){

    return products.filter( product => {

        // get the category name from category object

        let categoriesProduct = product.category.map(x => x.categoryName); 



        let showProduct = true;

        for(let categoryOfProduct of checkedSizes){

            if(!inArray(categoriesProduct, categoryOfProduct)){

                showProduct = false;

                return;

            }

        }

        return showProduct; // if there is a element, return it

    })

}



/* Checking if there is a specific element in the array */

    function inArray(array, element){

        return array.indexOf(element)!==-1;

    }



 /* Method for writting a message to the user if there are no products */

function noProductsMessage(whichArray, seachParametar = null, endOfTheSentence) {

    if(whichArray.length == 0) {

        $('#shopRight .shopBody-body').html(`There are no matching products with "${seachParametar}" ${endOfTheSentence}`);

        $('#shopRight .shopBody-footer').css('display', 'none');

     } else {

        $('#shopRight .shopBody-footer').css('display', 'block');

     }

}

/* IF THERE ARE MULTIPLE VALUES THAT NEED SEPARATOR , TO SEPPARATE THEM */

function writeValuesWithSeparator(whereFrom) {

    let ispis = "";

    whereFrom.forEach((element, i) => {

      i == 0 ? ispis += element : ispis += ", " + element

    });

    return ispis;

}



/* =========== RETURNING FROM MODULE ============= */

    return {

        onFilterByCategory, getProducts, getProductsForIndex, sortByProductNameAsc, sortByProductNameDecs, productQuickView, changeQuantity

    }

}





/* ================== CATEGORY MODULE ====================== */



function Categories() {



    let categories = [];

   

/* Get Products  */

function getCategories() {

    ajaxCallbackWithUrl("../data/categories.json", function(data) {

        categories = data 

        categoriesInHtmlHead() 

       categoriesInHtmlFooter()

       categoryCheckboxs()

    })

}

function getCategoriesForIndexPage() {

    ajaxCallbackWithUrl("/plantlife/data/categories.json", function(data) {

        categories = data 

            categoriesInHtmlHead() 

            categoriesInHtmlFooter()

    })

}





/* Dinamicly adding categories */

function categoriesInHtmlHead() {

    let categoriesInHtml = '<ul id="nav-links-bottom">';

    categories.forEach(category => {

            categoriesInHtml += `${categoriesInNav(category)}`;

    });

    categoriesInHtml += `</ul>`;

    $('#mainManu').html(categoriesInHtml);

    

}



function categoriesInHtmlFooter() {

    let categoriesInHtml = '<h4>SHOP</h4><ul>';

    categories.forEach(category => {

            categoriesInHtml += `${categoriesInNav(category)}`;

    });

    categoriesInHtml += `</ul>`;

    $('#footerMenu').html(categoriesInHtml);

    

}

function categoriesInNav(category) {

    let categoriesInHtml  = '';

    if(pageName != 'index.html') {

        categoriesInHtml +=  ` <li><a href="shop.html?${category.id}" >${category.categoryName}</a></li>`;

    } else if((pageName == 'index.html') )  {

        categoriesInHtml +=  ` <li><a href="pages/shop.html?${category.id}" >${category.categoryName}</a></li>`;

    }

    return categoriesInHtml;

}





function categoryCheckboxs() {

    let categoryCheck = ' <h3>Category</h3>';

    

    categories.forEach(function(category, index) {

        categoryCheck += `

        <div class="checkCategory">

        <label for="categoryFilter">

            <input type="checkbox" id="checkPlant${index+1}" class="size-element" name="categoryFilter" value="${category.categoryName}" data-categoryId = " ${category.id}" />

            ${category.categoryName}

        </label>

       <!-- <span class="categoryNumb">${categoryNumber(category.id)}</span>-->

    </div>

        `;





        $("#holderForPlants a").attr('href', 'pages/shop.html?' + category.id);

  

    });

    

        $('#checkboxCategories').html(categoryCheck);

        /* Calling functions */

        selectedCategoryFromNav()

        $('.size-element').click(moduleProducts.onFilterByCategory)

       // $('#checkboxCategories input[type=checkbox]').click(moduleProducts.filterByCategories);

    }

    

function categoryNumber(){

ajaxCallbackWithUrl('../data/products.json', function(data) {

    getProductsForNumberOfProductsForCategories(data);
console.log(data);

})

}

//FINISH THIS

function getProductsForNumberOfProductsForCategories(products) {

    products.forEach(product => {

        let catId = product.category.map(x => x.id);

        //console.log(catId.length)



    })

}



    function selectedCategoryFromNav() {

        var clickedNavLink = document.URL.split("?")[1];

      

        var arrayCheckboxes = document.querySelectorAll('.size-element');

       arrayCheckboxes.forEach(check => {

        let checkedId = check.getAttribute('id').split("checkPlant")[1];

           if(clickedNavLink == checkedId) {

                check.setAttribute('checked', 'checked');

                moduleProducts.onFilterByCategory()

           }

        });



    }

   



    return {

        getCategories, getCategoriesForIndexPage, categoriesInHtmlHead, categoriesInHtmlFooter

    }

}



/* ============== LOCALSTORAGE MODULE ================= */



function LocalStorage() {

    //Add to bag function

    addToShoppingBag()

    

    // Getting products from LS

    var products = productsInCart();

// Checking if there are any products in Cart

       if(products == null)

            showEmptyCart();

        else

            displayCartData();



    // Getting the product from LS

    function productsInCart() {

        return JSON.parse(localStorage.getItem("products"));

    }



    function addToShoppingBag() {// Getting the id selected

        let id = $(this).data("id");

var products = productsInCart();

// Cheching if product already exists in shopping bag if not adding it

    if(products) {

        if(productIsAlreadyInCart()) {

            updateQuantityMultipleClickOnProduct();

        } else {

            addToLocalStorage()

        }

    } else {

        addFirstItemToLocalStorage()

    }



    //REDIRECT USER WHEN HE ADDS PRODUCT TO SHOP

    //location.replace("http://vulovic.rs/plantlife/pages/shop.html") 

    //location.replace("http://localhost/plantlife/pages/cart.html") 





   



        function productIsAlreadyInCart() {

            return products.filter(p => p.id == id).length;

        }

        

        function addToLocalStorage() {

            let products = productsInCart();

            var quantityNumb = moduleProducts.changeQuantity();

            products.push({

                id : id,

                quantity : quantityNumb

            });

            // Entering product in shopping bag - LS

            localStorage.setItem("products", JSON.stringify(products));

        }

    

        function updateQuantityMultipleClickOnProduct() {

            let products = productsInCart();

            for(let i in products)

            {

                if(products[i].id == id) {

                    products[i].quantity++;

                    break;

                }      

            }

    }



    function addFirstItemToLocalStorage() {

        let products = [];

        products[0] = {

            id : id,

            quantity : 0

        };

        localStorage.setItem("products", JSON.stringify(products));

    }

}//End of LocalStorage



function displayCartData() {

    let products = productsInCart();

 

// Which page should get the data

let urlForCart = "";

if(pageName != "index.html") {

    urlForCart = "../data/products.json";

} else {

    urlForCart = "/plantlife/data/products.json";

}

    ajaxCallbackWithUrl(urlForCart, function(data) {

        let productsForDisplay = [];

        //Replacing data from json with the ones from localstorage

            data = data.filter(p => {

                for(let prod of products)

                {

                    if(p.id == prod.id) {

                        p.quantity = prod.quantity;

                        return true;

                    }          

                }

                return false;

            });

            generateTable(data)

            updateSmallShoppingBag(data)

    })

}



function updateSmallShoppingBag(products) {

    let insertSmallProduct = '';

        products.forEach(product => {

            insertSmallProduct += smallShopingBagUpdate(product);

        });

        $('#showSmallProducts').html(insertSmallProduct);



        //Show number of items in cart in NAV

        if(products != null) {

                let numberOfProductsInABag = updateNumberOfProductsInABag(products);

                $('#shoppedItemsNumberBag').html(numberOfProductsInABag);

        } 

        if(products == 0) {

            $('#shoppedItemsNumberBag').css('display', 'none')

            $('#showSmallProducts').html('<li><h2>Shoping bag is empty</h2></li>')

        }  

}

// Get the number of items in cart

function updateNumberOfProductsInABag(products) {

    return products.length;

}  







function smallShopingBagUpdate(product) {

        return `

        <li>  

        <img src="${productImageBasedPage(product.productImage)}" alt="${product.productName}">

        <div class="shoppingCartMini-productDesc">

            <h3>${product.productName}</h3>

            <span class="shoppingCartMini-productPrice">$${product.price.oldPrice}</span>

            <span class="shoppingCartMini-productQuantity">x ${product.quantity}</span>

        </div>

    </li>

        `;

}

function productImageBasedPage(productImage) {

    if((pageName == 'index.html') )  {

        return productImage.split("../")[1]

    } else {

        return productImage

    }

}



function generateTable(products) {

    let html = `<table>

    <thead><tr>

        <th>Product Image</th>

        <th>Product Details</th>

        <th>QUANTITY</th>

        <th>PRICE</th>

        <th>SHIPPING  DETALS</th>

        <th>EDIT CART</th>

    </tr></thead>

    <tbody>

    `;

                

    for(let product of products) {

        html += showProductInCart(product);



        //Getting the data for Subtotal part

        var getSubtotal = calculatePriceTimesQuantity(product.price.oldPrice, product.quantity);

        var getShipping = product.shippingPrice;

        var getTotal = calculateSubtotal(product.price.oldPrice, product.quantity, product.shippingPrice);

        //var calcTotalWithCoupone = calculateSubtotalWithCoupone(product.price.oldPrice, product.quantity, product.shippingPrice)

    }



    html += `</tbody>

    <tfoot>

        <tr>

            <td>Coupone Code:</td>

            <td>

            <div>

            <div class="select-holder">

            

                </div>

                <div id="cuponeInput">



                <div class="input-group">

                <label for="cuponeInputPassword">Enter the password for the coupone</label>

                <input type="text" id="cuponeInputPassword" name="cuponeInputPassword" placeholder="Enter the password for the coupone">

                <a class="btnDark" id="enterCoupone">Submit</a>

                <!-- Error Message  -->

                <div id="couponePassError" class="error" style="display: none;">

                        <p class="errorMsg">Password for the coupone is not correct</p>

                        <span class="worningSign"></span>

                    </div>

                </div>

                    </div>

                </div>

            </td>

            <td colspan="4" align="right">

                    <div>CART SUBTOTAL(${updateNumberOfProductsInABag(products)} ITEMS): 

                    <span class="shippingPrice">${getSubtotal}$</span></div>

                    <div>Shipping: <span class="shippingPrice">${getShipping}$</span></div>

                    <div id="couponeDiscount"></div>

                    <div>TOTAL: <span id="totalPriceCart" class="shippingPrice">${getTotal}$</span></div>

            </td>

        </tr>

    </tfoot>

    </table>`;



        if(products.length != 0) {

            $("#cartForm").html(html);

        } else {

            $("#cartSection").html('<h2>SHOPPING CART IS EMPTY</h2>')

        }       

             

     }



function calculateSubtotal(price, qty, shipping) {

    //Calculating price, converting it to string

    let calculateSubtotalPrice = String((price * qty) + shipping);



    //Finding the '.' separator to get its index

    let cutThePriceAfterDot = calculateSubtotalPrice.indexOf(".");



    //Adding 3 so it would be shown 3 caracters after a '.' on it and converting it to string so that substr can work with it

    let secondArgForString = String(parseFloat(cutThePriceAfterDot) + 3);



    // Substring the price to be in format od 16.00 instead of 16.00000000001

    return calculateSubtotalPrice.substr(0, secondArgForString) 

}





    // Show products in a table on SHOPPING CART page

    function showProductInCart(product) {

       return  `<tr id="row${product.id}">

       <td><img src="${product.productImage}" alt="${product.productName}"></td>

       <td><h3>White Round-shaped Pot with Bamboo Tray</h3></td>

       <td>

       <div class="section50flex quantityBtns" id="${product.id}">

                            <div class="section15"><a id="quantatyBtnPlus${product.id}">+</a></div>

                            <div class="section20" id="quantatyNumber${product.id}"> ${product.quantity}</div>

                            <div class="section15"><a id="quantatyBtnMinuse${product.id}">-</a></div>

                    </div>

               

           </select>

       </td>

       <td><span>${calculatePriceTimesQuantity(product.price.oldPrice, product.quantity)}$</span></td>

       <td><div>Shipping Price: <span class="shippingPrice">${product.shippingPrice}$</span></div>

           <div>Delivery Time: <span class="shippingPrice">${product.deliveryTime}</span></div>

       </td>

       <td>

       <a class="editIcon" data-id="${product.id}"></a>

       <a class="deleteIcon" data-id="${product.id}"></a>

       </td>

   </tr>`;

    }



    //moduleCoupone.enterCouponesInDDL();





function calculatePriceTimesQuantity(price, qty) {

    return price*qty;

}





    // Setting functionality on  click for delete and update



    $('.deleteIcon').click(removeFromCart)

    





    $('.quantityBtns a').click(changeQuantityInCart);

        function changeQuantityInCart() {

        // Getting the id of a parent element of clicked button in order to be able to select and insert changed number in html

       var parentOfClickedButton = $(this).parents().get(1).id;

        // Setting the number to start from number in which the user inserted it into cart

       let changeQuantityNumb ='#quantatyNumber' + parentOfClickedButton;

        // Converting string -> Number

       var quantityNumber = parseInt($(changeQuantityNumb).text());



        //Get the clicked button

        var clickedOn = $(this).attr('id');



        // Setting the adding or subtracking depend on which button was clicked

            if(clickedOn.indexOf("quantatyBtnPlus") != -1) {

                if(quantityNumber != 20) {

                    quantityNumber += 1;



                    //Update works only if quantity is changed

                    $('.editIcon').click(updateQuantityInCart)

                }

            } else if (clickedOn.indexOf("quantatyBtnMinuse") != -1) {

                if(quantityNumber != 1) {

                    quantityNumber -= 1;

                }





                //Update works only if quantity is changed

                $('.editIcon').click(updateQuantityInCart)

            } 

            // Inserting into html changed value

            $(changeQuantityNumb).html(quantityNumber);

    }







function showEmptyCart() {

    $("#cartForm").html("<h1>Your cart is empty!</h1>")

}



function productsInCart() {

    return JSON.parse(localStorage.getItem("products"));

}



function updateQuantityInCart() {

    // Getting the clicked btn to get its data-id attr

    let updateBtnClicked = $(this).data('id');



    // Getting the value od the clicked btn

    let changedQuantity = '#quantatyNumber' + updateBtnClicked;

    let changedQuantityNumber = parseInt($(changedQuantity).text());



    //Update cart

    let products = productsInCart();

    for(let i in products)

    {

        if(products[i].id == updateBtnClicked) {

            products[i].quantity = changedQuantityNumber



            //Insert data into localStorage

            localStorage.setItem("products", JSON.stringify(products));



            //Get data form Localstorage to show it

            let itemsUpdated = JSON.parse(localStorage.getItem("products"))

            displayCartData(itemsUpdated);



            $('#cartInfo').html(returnMessageToUserFromCart('Your changes have been saved'))

            //Return the message'

            

            

        }      

    }

}



function removeFromCart() {

    //Getting the data-id of clicked button

    let itemDelete = $(this).data('id');



    // Getting the data from ls and saving into new array only data that hasn't been removed from cart

    let products = productsInCart();

    let filtered = products.filter(p => p.id != itemDelete);



    //Setting the new array of products to localstorage

    localStorage.setItem("products", JSON.stringify(filtered));



    //Getting datafrom localstorage to show it in the table

    let itemsToDelete = JSON.parse(localStorage.getItem("products"))

    displayCartData(itemsToDelete);



    //Return message to user

    returnMessageToUserFromCart('The product has been removed form cart')

}



function returnMessageToUserFromCart(message) {

    //Write message in HTML

    let writeMessage = `<div class="infoMessageForCart">

        <div class="infoMessageForCart-body">

            <h2>${message}</h2>

        </div>

    </div>`;

        $('#cartInfo').html(writeMessage);



    // Remove the message after 2s

    setTimeout(function() {

        $('#cartInfo').html('');

     }, 2000);

   

}











 /* ============================== */  

    return {

     addToShoppingBag, displayCartData, removeFromCart, returnMessageToUserFromCart

    }

}



/* ============== COUPONEs =============  */

function Coupone() {

    let coupones = [];

    

    

    function getCoupone() {

        ajaxCallbackWithUrl('../data/cupones.json', function(data) {

           

            coupones = data;

            enterCouponesInDDL()

        });

    }

   

    // Enter Coupone into List

    function enterCouponesInDDL() {



        let enterCoupone =  `<span class="selectArrow"></span>

        <select id="cuponeCode">

        <option value="0">Select Coupone</option>`;

    

        coupones.forEach(coupone => {

            enterCoupone += writeCouponeInDDL(coupone);

        })



        enterCoupone += `</select>`;

        $('.select-holder').html(enterCoupone)

           

           //Calling the function on change in the DDl

           $('#cuponeCode').change(function(){

               //Getting the selected value aka id

               var selectedCouponeId = this.value;



               //Calling a function and giving it the id

               returnSelectedValue(selectedCouponeId);



        });

    }

    // HTML for ddl list for coupones

    function writeCouponeInDDL(coupone) {

        return `<option value="${coupone.id}">${coupone.couponeName}</option>`;

    }

    

    

    function returnSelectedValue(selectedId) {

        // Checking if the id selected exists in a coupone table

        if(selectedId != 0){

        coupones.forEach(coupone => {

            if(coupone.id == selectedId) {

              

                let selectedCouponeObj = coupone;

                let couponeSelectedId = coupone.id;

                //Checking if selected object has password property

                if(selectedCouponeObj.password == true) {

                    $('#cuponeInput').css('display', 'block')



                    //Adding event to password input to check if coupones password is the same as users password

                    $('#enterCoupone').click(function() {

                        checkIfThePasswordForCouponeMatch(couponeSelectedId)

                    })

                } else {

                    $('#cuponeInput').css('display', 'none')

                    console.log(selectedId);

                }

            }

            

        })

    } else {

        $('#cuponeInput').css('display', 'none')

    }

       

    }



//Checkong users input for cupone code with existing code in db

    function checkIfThePasswordForCouponeMatch(couponeSelectedId) {

        //Getting users entered data

        let couponePasswordInput = $('#cuponeInputPassword').val();

    

        //Going try json files

        coupones.forEach(password => {

           //Checking to see if the selected coupone and coupone in json match

            if((password.id == couponeSelectedId)) {

                 //Checking to see if users password matches the password in json

                if(password.passwordCode.couponeKey == couponePasswordInput) {

                    //Write the discount number in Subtotal section

                let couponePrecentNumber =  `Coupone Discount: <span class="shippingPrice">${password.couponeDiscount}%</span>`;

                $('#couponeDiscount').html(couponePrecentNumber)



                //Show the error message

                $('#couponePassError').css('display', 'none')



                // If the passwords match show user the message 

                moduleLocalStorage.returnMessageToUserFromCart('Your coupone has been accepted')



                //Clear the value from input and hide it

                $('#cuponeInputPassword').val(' ');

                $('#cuponeInputPassword').attr('placeholder', 'Enter the password for the coupone');

                $('#cuponeInput').css('display', 'none')

            }

            } else {

                //Show error message

                $('#couponeDiscount').html('')

                $('#couponePassError').css('display', 'block')

            }

        })

    }











    return {

        getCoupone, enterCouponesInDDL

    }

}





/* =================== CALLING MODULES ====================== */



let moduleProducts = Products();

let moduleCategories = Categories();

let moduleLocalStorage =  LocalStorage();

let moduleCoupone = Coupone();

if(pageName != 'index.html') {

    moduleProducts.getProducts()

    moduleCategories.getCategories()

    //moduleCoupone.returnSelectedValue();

    //moduleCoupone.calculateSubtotalWithCoupone();



    moduleCoupone.getCoupone();

    moduleCoupone.enterCouponesInDDL();

}



if((pageName == 'index.html') )  {

    // CALLING FUNCTION FOR 

    moduleProducts.getProductsForIndex()

    moduleCategories.getCategoriesForIndexPage()

    moduleLocalStorage.addToShoppingBag()

    moduleLocalStorage.removeFromCart()

}





function showQuickView() {

    moduleProducts.productQuickView()

   

}





    //Modal

    $('#closeModal-btn').click(function(){

        $('#showModal').css('display','none');

    });



    // Accordion

    $('#accordion li').click(function () {

        $(this).find('ul').slideToggle(500);

        $(this).toggleClass('active');

    });

    

   /* =========== TAB -> ACCORDION ======= */

   $('#tabAccLinks li a').click(function(e){



            $(this).attr('class', 'activeAboutNav')

    });



}); // END OF Document.ready