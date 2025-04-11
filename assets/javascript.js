
document.addEventListener('DOMContentLoaded', function () {
  const listUl = document.querySelector('.nav_produc');
  const listTop = document.querySelector('.nav_produc_top');
  const listCategory = document.querySelector('.right_category');

  fetch('./data.json')
    .then(response => response.json())
    .then(data => {
      const products = data.data;

      products.slice(0, 9).forEach((post, index) => {
        const html = renderProductHTML(post, `stars-Category${index}`);
        listCategory.insertAdjacentHTML('beforeend', html);
        document.getElementById(`stars-Category${index}`).innerHTML = renderStars(post.rating.rate);
      });

      // --- 1. Hiển thị 4 sản phẩm cho nav_produc ---
      products.slice(0, 4).forEach((post, index) => {
        const html = renderProductHTML(post, `stars-${index}`);
        listUl.insertAdjacentHTML('beforeend', html);
        document.getElementById(`stars-${index}`).innerHTML = renderStars(post.rating.rate);
      });

      // --- 2. Hiển thị 2 sản phẩm nếu mobile, 4 nếu desktop cho nav_produc_top ---
      

      products.sort((a, b) => b.rating.count - a.rating.count).slice(0, 4).forEach((post, index) => {
        const html = renderProductHTML(post, `stars-Top${index}`);
        listTop.insertAdjacentHTML('beforeend', html);
        document.getElementById(`stars-Top${index}`).innerHTML = renderStars(post.rating.rate);
      });
    });

  // === Hàm render sản phẩm ===
  function renderProductHTML(post, rateId) {
    let priceHasHtml = '';
    let discountHtml = '';

    if (post.price_has) {
      const discountPercent = Math.round(((post.price_has - post.price) / post.price_has) * 100);
      priceHasHtml = `<div class="price_or">$${post.price_has}</div>`;
      discountHtml = `<div class="discount">-${discountPercent}%</div>`;
    }

    return `
      <a href="detail.html?id=${post.id}">
        <div class="img">
            <img src="${post.image}" alt="">
        </div>
        <h4>${post.title}</h4>
        <div class="Evaluate">
            <div id="${rateId}"></div>
            <p> ${post.rating.rate}<span>/5</span></p>
        </div>
        <div class="price">
          <div class="price_has">$${post.price}</div>
          ${priceHasHtml}
          ${discountHtml}
        </div>
      </a>
    `;
  }

  // === Hàm render sao đánh giá ===
  function renderStars(rate) {
    const fullStars = Math.floor(rate);
    const halfStar = rate % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

    let stars = '';
    for (let i = 0; i < fullStars; i++) stars += '<i class="fas fa-star" style="color:gold;"></i>';
    if (halfStar) stars += '<i class="fas fa-star-half-alt" style="color:gold;"></i>';
    for (let i = 0; i < emptyStars; i++) stars += '<i class="far fa-star" style="color:gold;"></i>';
    return stars;
  }
});




// Slider
$('.slider_conten').slick({
  slidesToShow: 3,
  slidesToScroll: 1,
  autoplay: true,
  prevArrow:false,
  nextArrow:false,
  dots: false,
  infinity: true,
  //centerMode: true,

  autoplaySpeed: 1550,
  responsive: [
      {
          breakpoint: 1023,
          settings: {
              slidesToShow: 2,
              slidesToScroll: 1,
             
          },
      },
      {
          breakpoint: 739,
          settings: {
              slidesToShow: 1,
              slidesToScroll: 1,
              
          },
      },
  ],
});

$('.btn.prev').click(function () {
  $('.slider_conten').slick('slickPrev');
});

$('.btn.next').click(function () {
  $('.slider_conten').slick('slickNext');
});





// validate
  const form = document.getElementById('emailForm');
  const emailInput = document.getElementById('email');
  const errorText = document.getElementById('error');

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    const emailValue = emailInput.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (emailRegex.test(emailValue)) {
      errorText.style.display = 'none';
      alert('Email hợp lệ: ' + emailValue);
      // Gửi form hoặc thực hiện hành động khác ở đây
    } else {
      errorText.style.display = 'block';
    }
  });



  // filter giá 
  
  
  const minInput = document.getElementById('minPrice');
  const maxInput = document.getElementById('maxPrice');
  const minBubble = document.getElementById('minBubble');
  const maxBubble = document.getElementById('maxBubble');
  const sliderTrack = document.querySelector('.slider-track');
  const max = parseInt(minInput.max);

  function setPosition(input, bubble) {
    const val = parseInt(input.value);
    const percent = (val / max) * 100;
    bubble.innerText = `$${val}`;
    bubble.style.left = `calc(${percent}% + (${8 - percent * 0.15}px))`; // tùy chỉnh lệch cho đẹp
    return percent;
  }

  function updateSlider() {
    let minVal = parseInt(minInput.value);
    let maxVal = parseInt(maxInput.value);

    if (minVal > maxVal - 20) {
      minVal = maxVal - 20;
      minInput.value = minVal;
    }
    if (maxVal < minVal + 20) {
      maxVal = minVal + 20;
      maxInput.value = maxVal;
    }

    const percent1 = setPosition(minInput, minBubble);
    const percent2 = setPosition(maxInput, maxBubble);

    sliderTrack.style.background = `linear-gradient(to right, #ddd ${percent1}%, black ${percent1}%, black ${percent2}%, #ddd ${percent2}%)`;
  }

  minInput.addEventListener('input', updateSlider);
  maxInput.addEventListener('input', updateSlider);

  updateSlider();


  // ẩn hiện giá
  const toggleFilter = document.getElementById('toggleFilter');
  const priceSlider = document.getElementById('priceSlider');
  const arrowIcon = document.getElementById('arrowIcon');

  toggleFilter.addEventListener('click', () => {
    priceSlider.classList.toggle('show');
    arrowIcon.innerHTML = priceSlider.classList.contains('show') ? ' <i class="fas fa-chevron-right" style="transform: rotate(90deg);"></i>' : ' <i class="fas fa-chevron-right"></i>';
  });


  // lọc theo sao
  const toggleRating = document.getElementById('toggleRating');
  const ratingFilter = document.getElementById('ratingFilter');
  const arrowRating = document.getElementById('arrowRating');

  toggleRating.addEventListener('click', () => {
    ratingFilter.classList.toggle('show');
    arrowRating.innerHTML = ratingFilter.classList.contains('show') ? ' <i class="fas fa-chevron-right" style="transform: rotate(90deg);"></i>' : ' <i class="fas fa-chevron-right"></i>';
  });

  const stars = document.querySelectorAll('.rating-stars .star');

  stars.forEach((star, index) => {
    star.addEventListener('click', () => {
      // Remove previous selection
      stars.forEach(s => s.classList.remove('selected'));

      // Highlight selected stars
      for (let i = 0; i <= index; i++) {
        stars[i].classList.add('selected');
      }

      // Bạn có thể lấy giá trị số sao được chọn như sau:
      const ratingValue = star.getAttribute('data-value');
      console.log('Rating selected:', ratingValue);
    });
  });



  // ẩn hiện fil mobbi
  const openBtn = document.getElementById('openFilterMenu');
  const closeBtn = document.getElementById('closeFilterMenu');
  const filterMenu = document.getElementById('filterMenu');
  const overlay = document.getElementById('overlay');

  openBtn.addEventListener('click', () => {
    filterMenu.classList.add('show');
    overlay.classList.add('show');
  });

  closeBtn.addEventListener('click', () => {
    filterMenu.classList.remove('show');
    overlay.classList.remove('show');
  });

  overlay.addEventListener('click', () => {
    filterMenu.classList.remove('show');
    overlay.classList.remove('show');
  });



 
  
  function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartCountEl = document.getElementById('cart-count');
    if (cartCountEl) {
        cartCountEl.textContent = count;
    }
}
window.addEventListener('DOMContentLoaded', updateCartCount);
