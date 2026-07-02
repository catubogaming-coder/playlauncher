// Oyna butonuna tıklandığında çalışacak fonksiyon
function playGame(gameName) {
    // Burada ileride gerçek oyun bağlantılarını (iframe veya yeni sayfa) açabilirsin.
    // Şimdilik bir uyarı mesajı gösteriyoruz.
    alert("Başlatılıyor: " + gameName + "!\n(Oyun dosyaları yakında eklenecek...)");
}

// Arama kutusunu dinleme ve oyunları filtreleme
document.getElementById('searchInput').addEventListener('keyup', function(event) {
    let searchQuery = event.target.value.toLowerCase();
    let gameCards = document.querySelectorAll('.game-card');

    gameCards.forEach(function(card) {
        let gameTitle = card.querySelector('h3').innerText.toLowerCase();
        
        if (gameTitle.includes(searchQuery)) {
            card.style.display = "block";
        } else {
            card.style.display = "none";
        }
    });
});
