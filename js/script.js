window.onload = function() {
    if(document.URL == "http://vulovic.rs/plantlife/") {
    location.replace("http://vulovic.rs/plantlife/index.html")   
}
    // Getting the page name and calling functions based on the page thaht user is on
     
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
    


 
    




    /* =========== END OF TAB -> ACCORDION ======= */
    }); //End od $(document)
    
