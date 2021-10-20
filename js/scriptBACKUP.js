window.onload = function() {
    
// Getting the page name and calling functions based on the page thaht user is on

var getPage = document.URL.split("/");
var pageName = getPage[getPage.length - 1];



    if (window.innerWidth >= 780) {
        /* Prikaz search-a u navigaciji na klik dugmenta */
    document.querySelector("#seachFormBtn").addEventListener("click", function(e) {
        e.preventDefault();
        if(document.querySelector("#seachFilter").getAttribute('class') == "hidden"){
            document.querySelector("#seachFilter").setAttribute("class", "showen");
            document.querySelector("#seachFormBtn").setAttribute("class", "exitIcon");

        } else if(document.querySelector("#seachFilter").getAttribute('class') == "showen") {

            document.querySelector("#seachFilter").setAttribute("class", "hidden");
            document.querySelector("#seachFormBtn").setAttribute("class", "searchIcon");
        }
    });

}

}//End of window.onload


/* jQuery */
$(document).ready(function () {

/* ============ FUNCTION FOR AJAX ============ */
function callAjax(url, customFunction) {
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


    /* ========== Products from json ========== */

            callAjax('../data/products.json', productsInHtml);
            callAjax('../data/products.json', productQuickView);
            callAjax('../data/products.json', sortByCategory);
            callAjax('../data/products.json', filterByPrice);
            callAjax('../data/products.json', seachByName);
            callAjax('../data/products.json', sortByAzZaPriceLowHigh);
            callAjax('../data/products.json', pagination);
           
            
            


    function productsInHtml(products) {
        var productsHtml = "";

        products.forEach(product => {
            productsHtml += `
            <!-- Product -->
            <article class="productSingle" data-category="${getCategories(product.category)}">
                <img src="${product.productImage}" alt="${product.productName}">
                <h3>${product.productName}</h3>
                <div class="price">
                    <span class="newPrice">${product.price.oldPrice}$</span>
                </div>
                <!-- On hover, show -->
                <div class="overlayWhite">
                    <a class="quickView btnBorderDark" href="#" data-id="${product.id}">Quick View</a>
                </div>
            </article>
            <!-- End of Product -->
            `;
        });

        $(".shopBody-body").html(productsHtml);
        productQuickView(products);
        
    }

    /* ============== SHOWING PRODUCTS IN MODAL - QUICK VIEW =============== */

    function getCategories(product) {
        let categoryInHtml = '';
        product.forEach(category => {
            categoryInHtml += category.categoryName;
        });
        return categoryInHtml;
    }
/* Inserting data based on id paremetar in popup modal */

function productQuickView(products) {

    /*var urlJquery = $(location).attr('href').split('?');
    var gettingClickedQuickView = urlJquery[1];*/
$('.quickView').click(function(e){

e.preventDefault();
    var gettingClickedQuickView = $(this).data('id');
var quickView = "";

products.forEach(product => {
    if(gettingClickedQuickView == product.id) {
        $('#showModal').css('display','block');
            quickView += `
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
                            <div class="section15" ><a href="#" id="quantatyBtnPlus">+</a></div>
                            <div class="section20" id="quantatyNumber">1</div>
                            <div class="section15" ><a href="#" id="quantatyBtnMinuse">-</a></div>
                    </div>
                </div>

            <div class="btnLinks">
                        <a href="" class="btnDark" data-id="${product.id}">Add to bag</a>
                        <a href="" class="btnLinkWithIcon" data-id="${product.id}"><div class="gift-bag"></div> Send as a gif</a>
                </div>
            `;
    }
});


$("#aboutProduct-body").html(quickView);

sliderImageWithRadio();
changeQuantity();



/*
sortByCategory(products);
filterByPrice(products);
seachByName(products);
*/




});
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

function sortByAzZaPriceLowHigh(products) {
    $('#sortProducts').change(function() {
        var getSelectedOption = $(this).val();
        //console.log(getSelectedOption);
        if(getSelectedOption == 'az') {
            sortIt(products, 'productName', 1, -1, null);
        }
        if(getSelectedOption == 'za') {
            sortIt(products, 'productName', -1, 1, null);
        }
        if(getSelectedOption == 'priceHighLow') {
            sortIt(products, "price.oldPrice", -1, 1);
        }
        if(getSelectedOption == 'priceLowHigh') {
            sortIt(products, "price.oldPrice", 1, -1);
        }
    });
    
}
/* Funchion for sorting which accepts 4 parametars: data, which object, and 2 parametars for sorting by */
function sortIt(productData, which, param1, param2) {

    productData.sort((sortA, sortZ) => {
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

productsInHtml(productData);
}

function sortByCategory(products) {
// Checkbox-es

}

function filterByPrice(products) {

    $('#filterPrice').change(function() {
        // Getting the value choosen
        var rangePrice = $('#filterPrice').val();

        //setting Max attribute based on products higest price
        
    
        // Writting in HTML selected value
        $('#chosenPrice').html("form 0 to " + rangePrice);
       

        
        var priceChosenArray = products.filter(price => {
            return (price.price.oldPrice <= rangePrice);
            
        });

        priceRangeSorted(priceChosenArray);
        function priceRangeSorted(priceChosenArray) {
        priceChosenArray.sort((price1, price2) => {
            console.log(price1.price.oldPrice);
            if(price1.price.oldPrice == price2.price.oldPrice ) {
                return 0;
            }
            if(price1.price.oldPrice > price2.price.oldPrice) {
                return 1;
            }
        });
  
    }
  
    productsInHtml(priceChosenArray);
       
    });
   
}

function seachByName(products) {
    $('#filterSearch').keyup(function() {
        // Getting users search parametars
        var seachParametar = $(this).val();

        const filterBySearchParam = products.filter(function(search) {
            if(search.productName.toLowerCase().indexOf(seachParametar.toLowerCase()) !== -1) 
            {
                return true;
            }
        });
        productsInHtml(filterBySearchParam);
    });
}

      



     /* ========== End of Products from json ========== */

    /*Meni open, close on #menuBtn click start at the 780px width */
    $windowWidth = $(window).width();

    if($windowWidth <= 780) {
    $('#menuBtn').click(function(){
        $("#lowerNav").slideToggle();
    });
    }

    /* Slider */

    $('.rightArrow').click(function(e){
        e.preventDefault();
        var firstParemetar = "#" + $(this).parents().get(1).id;
        sliderNext(firstParemetar,':first');
    });

    $('.leftArrow').click(function(e){
        e.preventDefault();
        var firstParemetar = "#" + $(this).parents().get(1).id;
        sliderNext(firstParemetar,':last');
    });

    if($('.slider.auto')) {
        var idAuto = "#" + $('.slider.auto').attr('id');
        function autoSlide() {    
            sliderNext(idAuto,':first');
            
        }
        setInterval(autoSlide, 4000);
    }
    
    /* Function for slider functionality */
function sliderNext(which,direction) {
    var current = $(which + ' .active');
    var next = current.next().length?current.next():current.parent().children(direction);

    current.hide().removeClass('active');
    next.fadeIn().addClass('active');
}


/*------- PRODUCT SLIDER ------ */

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
},function(){
    timer = setInterval(slider('.sliderItem:first-child'), 2000);
});


/* ========== Modal POPUP ============ */
	//Modal
    $('#closeModal-btn').click(function(){
        $('#showModal').css('display','none');
    });

/* ========== SLider with Radio Btns ============ */
function sliderImageWithRadio() {
$("#radioButtons li a").click(function(e){
    e.preventDefault();

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
  
});
}




    /* ===== QUANTITY ======= */
    

    function changeQuantity(){
        // Setting quantity to default value
        var quantityNumber = 1;
        $('#quantityBtns a').click(function(e){
            //Get the clicked button
            var clickedOn = $(this).attr('id');

            // Setting the adding or subtracking depend on which button was clicked
                e.preventDefault(); 

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
        });
    }

    /* ===== SHOW LIST OR GIRD VIEW PRODUCTS ======= */

    changeProductViewToListOrGrid();

    function changeProductViewToListOrGrid(){
        $('#productsView li a').click(function(e){
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

        });
    }
    
     /* ===== PAGINATION ======= */
 

     function pagination(products){

        // Getting the products
        var brPrikazaPoStranici = 6;
        var products = products;

        insertPaginationLinks(brPrikazaPoStranici, products);
        getActivePaginationLink(brPrikazaPoStranici, products);
        
        
     }

     function insertPaginationLinks(brPrikazaPoStranici, products) {
   
        pagination = "";
            
            var showNumbProductsAtATime = Math.ceil((products.length) / brPrikazaPoStranici);
              // Showing number of pages based on number of products that is going to be shown
                for(let j = 0; j < showNumbProductsAtATime; j++) {
                    pagination += `<li><a href='#' data-numberShown='${((j + 1)*brPrikazaPoStranici)}'>${(j + 1)}</a></li>`;
                }
    
            $("#pagination").html(pagination);
            $("#pagination li a:first-of-type").attr('class', 'activePagination')
           
            getActivePaginationLink(brPrikazaPoStranici, products);
    }

  
     


function paginationFunctionality(brPrikazaPoStranici, products, paginationPage) {


            let productsHtml = '';
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
                  console.log(index, products[index])
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

function getActivePaginationLink(brPrikazaPoStranici, products) {
    $("#pagination li a").click(function(e){
        e.preventDefault(); 

        
        var paginationPage = $(this).data('numbershown');
        
        console.log(paginationPage);
        if( $("#pagination li a").attr('class', 'activePagination')) {
            $("#pagination li a").removeClass('activePagination');
            $(this).addClass('activePagination');
        } else {
            $(this).removeClass('activePagination');
        }

        paginationFunctionality(brPrikazaPoStranici, products, paginationPage);

        
});

}

/* =========== TAB -> ACCORDION ======= */
$('#tabAccLinks li a').click(function(e){
    e.preventDefault();

    var getTheClickedId = $(this).attr('href');
    var tabAccDiv = $('#aboutRight .tabAccDiv');
    tabAccDiv.forEach(ta => {
        ta.attr('id');
    });

    console.log(tabAccDiv);
});

/* =========== END OF TAB -> ACCORDION ======= */
}); //End od $(document)



/*
With FOR 

unction paginationFunctionality(brPrikazaPoStranici, products, paginationPage) {


            let productsHtml = '';
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
                  console.log(index, products[index])
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

*/