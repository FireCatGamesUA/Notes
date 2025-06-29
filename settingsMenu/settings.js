let lang = false;
let look = false;

$(document).ready(function(){
    $(".chooseLang").click(function(){
        if(!lang){
            $(".chooseLang").html('<img src="/resourses/icons/ukraineFlagDraw.png" alt="" width="18px" height="18px"><p>Ukrainian</p>');
            lang = true;
        }
        else{
            $(".chooseLang").html('<img src="/resourses/icons/englishFlagDraw.png" alt="" width="18px" height="18px"><p>English</p>');
            lang = false;
        }
    });
    $(".chooseLook").click(function(){
        if(!look){
            $(".chooseLook").html('<img src="/resourses/icons/rows.png" alt="" width="18px" height="18px"><p>Rows</p>');
            look = true;
        }
        else{
            $(".chooseLook").html('<img src="/resourses/icons/grids.png" alt="" width="18px" height="18px"><p>Grids</p>');
            look = false;
        }
    });
});