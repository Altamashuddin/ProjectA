// Smooth scrolling
$(document).ready(function(){
    $('a.nav-link').click(function(){
        $('html, body').animate({
            scrollTop: $($(this).attr('href')).offset().top - 50
        }, 800);
        return false;
    });
});

// Form validation
$('form').submit(function(e){
    let name = $('input[name="name"]').val();
    let email = $('input[name="email"]').val();
    
    if(name === '' || email === ''){
        alert('Please fill in all fields');
        e.preventDefault();
    }
});
