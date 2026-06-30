let searchForm = document.querySelector('.search-form');
let shoppingCart = document.querySelector('.shopping-cart');
let loginForm = document.querySelector('.login-form');
let passwordForm = document.querySelector('.password-form');
let registerForm = document.querySelector('.register-form');
let navbar = document.querySelector('.navbar');
let loginBtn = document.querySelector('#login-btn');
let deliveryForm = document.querySelector('.delivery-form');

function hideAllPanels() {
    searchForm.classList.remove('active');
    shoppingCart.classList.remove('active');
    loginForm.classList.remove('active');
    passwordForm.classList.remove('active');
    registerForm.classList.remove('active');
    deliveryForm.classList.remove('active');
    navbar.classList.remove('active');
}

document.querySelector('#search-btn').onclick = () => 
    {
        searchForm.classList.toggle('active');
        shoppingCart.classList.remove('active');
        loginForm.classList.remove('active');
        passwordForm.classList.remove('active');
        registerForm.classList.remove('active');
        navbar.classList.remove('active');
    };


document.querySelector('#cart-btn').onclick = () => 
    {
        shoppingCart.classList.toggle('active');
        searchForm.classList.remove('active');
        loginForm.classList.remove('active');
        passwordForm.classList.remove('active');
        registerForm.classList.remove('active');
        navbar.classList.remove('active');
    };

document.querySelector('#login-btn').onclick = () => 
    {
        loginForm.classList.toggle('active');
        searchForm.classList.remove('active');
        shoppingCart.classList.remove('active');
        passwordForm.classList.remove('active');
        registerForm.classList.remove('active');
        navbar.classList.remove('active');
    };

document.querySelector('#menu-btn').onclick = () => 
    {
        navbar.classList.toggle('active');
        searchForm.classList.remove('active');
        shoppingCart.classList.remove('active');
        loginForm.classList.remove('active');
        passwordForm.classList.remove('active');
        registerForm.classList.remove('active');
    };

document.querySelector('#reset-link').onclick = (event) =>
    {
        event.preventDefault();
        passwordForm.classList.toggle('active');
        loginForm.classList.remove('active');
        registerForm.classList.remove('active');
        searchForm.classList.remove('active');
        shoppingCart.classList.remove('active');
        navbar.classList.remove('active');
    };

document.querySelector('#register-link').onclick = (event) =>
    {
        event.preventDefault();
        registerForm.classList.toggle('active');
        loginForm.classList.remove('active');
        passwordForm.classList.remove('active');
        searchForm.classList.remove('active');
        shoppingCart.classList.remove('active');
        navbar.classList.remove('active');
    };

let cartItems = {};
let cartTotal = document.querySelector('.shopping-cart .total');
let checkoutBtn = document.querySelector('.shopping-cart .btn');
let cartCount = document.querySelector('.cart-count');

function isLoggedIn() {
    return Boolean(localStorage.getItem('loggedInUser'));
}

function getLoggedUser() {
    const loggedEmail = localStorage.getItem('loggedInUser');
    const users = JSON.parse(localStorage.getItem('users')) || {};
    return loggedEmail && users[loggedEmail] ? users[loggedEmail] : null;
}

checkoutBtn.addEventListener('click', (event) => {
    event.preventDefault();

    if (Object.keys(cartItems).length === 0) {
        alert('Your cart is empty. Add items before checkout.');
        return;
    }   

        const user = getLoggedUser();

    if (!user) {
        localStorage.removeItem('loggedInUser');
        hideAllPanels();
        loginForm.classList.add('active');
        alert('Please login before checkout.');
        return;
    }

    hideAllPanels();
    deliveryForm.classList.add('active');
});

deliveryForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const inputs = document.querySelectorAll('.delivery-form .box');
    const fullName = inputs[0].value.trim();
    const street = inputs[1].value.trim();
    const city = inputs[2].value.trim();
    const state = inputs[3].value.trim();
    const phone = inputs[4].value.trim();

    if (!fullName || !street || !city || !state || !phone) {
        alert('Please fill in all delivery details.');
        return;
    }

    const user = getLoggedUser();

    Object.keys(cartItems).forEach((name) => {
        cartItems[name].element.remove();
    });
    cartItems = {};
    updateCartTotal();
    checkoutBtn.innerHTML = 'Delivered <i class="fa fa-check-circle"></i>';
    checkoutBtn.classList.add('completed');
    checkoutBtn.disabled = true;

    deliveryForm.classList.remove('active');
    inputs.forEach(input => input.value = '');

    alert(`Order confirmed! ${user.firstName}, your items will be delivered to ${street}, ${city}, ${state}.`);
});

function getProductPrice(priceText) {
    return Number(priceText.replace(/,/g, '').replace(/[^0-9.]/g, ' ').trim().split(' ')[0]);
}

function updateCartTotal() {
    let total = 0;
    let count = 0;

    Object.values(cartItems).forEach((item) => {
        total += item.price * item.quantity;
        count += item.quantity;
    });

    cartTotal.innerText = `Total : #${total}/-`;
    cartCount.innerText = count;
}

function addProductToCart(productBox) {
    let productName = productBox.querySelector('h3').innerText;
    let productImage = productBox.querySelector('img').getAttribute('src');
    let productPrice = getProductPrice(productBox.querySelector('.price').innerText);

    if (cartItems[productName]) {
        cartItems[productName].quantity++;
        cartItems[productName].element.querySelector('.quantity').innerText = `${cartItems[productName].quantity}`;
    } else {
        let cartBox = document.createElement('div');
        cartBox.classList.add('box');
        cartBox.innerHTML = `
            <i class="fa fa-trash"></i>
            <img src="${productImage}" alt="">
            <div class="content">
                <h3>${productName}</h3>
                <span class="price">#${productPrice}/-</span>
                <div class="qty-controls">
                    <button class="qty-btn qty-minus">-</button>
                    <span class="quantity">1</span>
                    <button class="qty-btn qty-plus">+</button>
                </div>
            </div>
        `;

        shoppingCart.insertBefore(cartBox, cartTotal);

        cartItems[productName] = {
            price: productPrice,
            quantity: 1,
            element: cartBox,
        };

        cartBox.querySelector('.qty-minus').onclick = () => {
            cartItems[productName].quantity--;
            if (cartItems[productName].quantity > 0) {
                cartBox.querySelector('.quantity').innerText = cartItems[productName].quantity;
                updateCartTotal();
            } else {
                cartBox.remove();
                delete cartItems[productName];
                updateCartTotal();
            }
        };

        cartBox.querySelector('.qty-plus').onclick = () => {
            cartItems[productName].quantity++;
            cartBox.querySelector('.quantity').innerText = cartItems[productName].quantity;
            updateCartTotal();
        };

        cartBox.querySelector('.fa-trash').onclick = () => {
            cartBox.remove();
            delete cartItems[productName];
            updateCartTotal();
        };
    }

    if (checkoutBtn.classList.contains('completed')) {
        checkoutBtn.classList.remove('completed');
        checkoutBtn.disabled = false;
        checkoutBtn.innerHTML = 'Checkout';
    }

    updateCartTotal();
    shoppingCart.classList.add('active');
    searchForm.classList.remove('active');
    loginForm.classList.remove('active');
    passwordForm.classList.remove('active');
    registerForm.classList.remove('active');
    navbar.classList.remove('active');
}

document.querySelector('.products').addEventListener('click', (event) => {
    if (event.target.classList.contains('btn')) {
        event.preventDefault();
        addProductToCart(event.target.closest('.box'));
    }
});

// Search functionality
let searchBox = document.querySelector('#search-box');
searchBox.addEventListener('keyup', (event) => {
    let searchTerm = event.target.value.toLowerCase();
    let products = document.querySelectorAll('.product-slider .box');
    
    products.forEach((product) => {
        let productName = product.querySelector('h3').innerText.toLowerCase();
        
        if (productName.includes(searchTerm) || searchTerm === '') {
            product.style.display = 'block';
        } else {
            product.style.display = 'none';
        }
    });
});

document.querySelector('.blogs').addEventListener('click', (event) => {
    const btn = event.target.closest('.read-more-btn');

    if (!btn) {
        return;
    }

    event.preventDefault();

    const blogBox = btn.closest('.blog-box');
    const wasExpanded = blogBox.classList.contains('expanded');

    document.querySelectorAll('.blogs .blog-box').forEach((box) => {
        box.classList.remove('expanded');
        box.querySelector('.read-more-btn').innerHTML = 'Read More';
    });

    if (!wasExpanded) {
        blogBox.classList.add('expanded');
        btn.innerHTML = 'Read Less';
    }
});

document.querySelector('.features').addEventListener('click', (event) => {
    const btn = event.target.closest('.read-more-btn');

    if (!btn) {
        return;
    }

    event.preventDefault();

    const featureBox = btn.closest('.box');
    const wasExpanded = featureBox.classList.contains('expanded');

    document.querySelectorAll('.features .box').forEach((box) => {
        box.classList.remove('expanded');
        box.querySelector('.read-more-btn').innerHTML = 'Read More';
    });

    if (!wasExpanded) {
        featureBox.classList.add('expanded');
        btn.innerHTML = 'Read Less';
    }
});

window.onscroll = () => 
    {
        searchForm.classList.remove('active');
        shoppingCart.classList.remove('active');
        loginForm.classList.remove('active');
        passwordForm.classList.remove('active');
        registerForm.classList.remove('active');
        navbar.classList.remove('active');
        deliveryForm.classList.remove('active');
    };

    var swiper = new Swiper(".home-slider", {
        loop:true,
        autoplay: {
            delay:5000,
            disableOnInteraction: false,
        },
        pagination: {
            el: ".home-slider .swiper-pagination",
            clickable: true,
        },
    });

    var swiper = new Swiper(".product-slider", {
        loop:true,
        spaceBetween: 20,
        autoplay: {
            delay:7500,
            disableOnInteraction: false,
        },
        centeredSlides: false,
        breakpoints: {
            0: {
                slidesPerView: 1,
            },
            768: {
               slidesPerView: 2, 
            },
            1020: {
                slidesPerView: 3,
            },
        },

    });

        var swiper = new Swiper(".review-slider", {
        loop:true,
        spaceBetween: 20,
        autoplay: {
            delay:7500,
            disableOnInteraction: false,
        },
        centeredSlides: false,
        breakpoints: {
            0: {
                slidesPerView: 1,
            },
            768: {
               slidesPerView: 2, 
            },
            1020: {
                slidesPerView: 3,
            },
        },

    });

    // Sign-up functionality
document.querySelector('.register-form').addEventListener('submit', (event) => {
    event.preventDefault();
    
    let inputs = document.querySelectorAll('.register-form .box');
    let firstName = inputs[0].value.trim();
    let lastName = inputs[1].value.trim();
    let phone = inputs[2].value.trim();
    let email = inputs[3].value.trim();
    let password = inputs[4].value.trim();
    
    if (!firstName || !lastName || !phone || !email || !password) {
        alert('Please fill all fields');
        return;
    }
    
    let users = JSON.parse(localStorage.getItem('users')) || {};
    
    if (users[email]) {
        alert('Email already registered!');
        return;
    }
    
    users[email] = {
        firstName,
        lastName,
        phone,
        password
    };
    
    localStorage.setItem('users', JSON.stringify(users));
    alert('Account created successfully! You can now login.');
    
    inputs.forEach(input => input.value = '');
    registerForm.classList.remove('active');
    loginForm.classList.add('active');
});

// Login functionality
document.querySelector('.login-form').addEventListener('submit', (event) => {
    event.preventDefault();
    
    let inputs = document.querySelectorAll('.login-form .box');
    let email = inputs[0].value.trim();
    let password = inputs[1].value.trim();
    
    if (!email || !password) {
        alert('Please enter email and password');
        return;
    }
    
    let users = JSON.parse(localStorage.getItem('users')) || {};
    
    if (!users[email]) {
        alert('Email not registered!');
        return;
    }
    
    if (users[email].password !== password) {
        alert('Incorrect password!');
        return;
    }
    
    localStorage.setItem('loggedInUser', email);
    alert(`Welcome back, ${users[email].firstName}!`);
    
    inputs.forEach(input => input.value = '');
    loginForm.classList.remove('active');
    
    setLoginButton();
});

function setLoginButton() {
    const btn = document.querySelector('#login-btn');
    const loggedEmail = localStorage.getItem('loggedInUser');
    const users = JSON.parse(localStorage.getItem('users')) || {};

    btn.innerHTML = '<span class="user-name"></span>';
    let nameSpan = btn.querySelector('.user-name');

    if (loggedEmail && users[loggedEmail]) {
        const firstName = users[loggedEmail].firstName || 'User';
        nameSpan.innerText = firstName;
        btn.title = `Logged in as ${firstName}`;
        btn.classList.add('logged-in');
        btn.onclick = () => {
            if (confirm('Do you want to logout?')) {
                localStorage.removeItem('loggedInUser');
                setLoginButton();
            }
        };
    } else {
        nameSpan.innerText = '';
        btn.title = 'Login';
        btn.classList.remove('logged-in');
        btn.onclick = () => {
            hideAllPanels();
            loginForm.classList.toggle('active');
        };
    }
}

// Password reset functionality
document.querySelector('.password-form').addEventListener('submit', (event) => {
    event.preventDefault();
    
    let email = document.querySelector('.password-form .box').value.trim();
    
    if (!email) {
        alert('Please enter your email');
        return;
    }
    
    let users = JSON.parse(localStorage.getItem('users')) || {};
    
    if (!users[email]) {
        alert('Email not found in our system');
        return;
    }
    
    alert('Password reset link has been sent to ' + email + '!');
    document.querySelector('.password-form .box').value = '';
    passwordForm.classList.remove('active');
    loginForm.classList.add('active');
});

// Newsletter subscription
const newsletterForm = document.querySelector('.newsletter-form');
if (newsletterForm) {
    newsletterForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const emailInput = document.querySelector('.newsletter-form .email');
        const email = emailInput.value.trim();

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email) {
            alert('Please enter your email to subscribe.');
            return;
        }

        if (!emailRegex.test(email)) {
            alert('Please enter a valid email address.');
            return;
        }

        const subscribers = JSON.parse(localStorage.getItem('newsletterSubscribers')) || [];
        const normalizedEmail = email.toLowerCase();

        if (subscribers.includes(normalizedEmail)) {
            alert('You are already subscribed!');
            emailInput.value = '';
            return;
        }

        subscribers.push(normalizedEmail);
        localStorage.setItem('newsletterSubscribers', JSON.stringify(subscribers));

        alert('Thanks for subscribing! You will now receive our latest updates.');
        emailInput.value = '';
    });
}

setLoginButton();
