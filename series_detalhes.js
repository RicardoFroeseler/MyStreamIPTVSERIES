const tmdbApiKey = "cf811f120299a8eb4e63c3c3a39037ad";
const tmdbBaseURL = "https://api.themoviedb.org/3/tv/";
const playerBaseURL = "https://embed.warezcdn.link/serie/";

// Obter ID da série da URL
function getSeriesIdFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get("id");
}

// Buscar detalhes da série no TMDB
async function fetchSeriesDetails(seriesId) {
    try {
        const response = await fetch(`${tmdbBaseURL}${seriesId}?api_key=${tmdbApiKey}&language=pt-BR`);
        return await response.json();
    } catch (error) {
        console.error("Erro ao carregar os detalhes da série:", error);
        return null;
    }
}

// Configurar o background da série
function setSeriesBackground(backdropPath) {
    const seriesBackground = document.getElementById("seriesBackground");
    if (backdropPath) {
        seriesBackground.style.backgroundImage = `url(https://image.tmdb.org/t/p/original${backdropPath})`;
    } else {
        seriesBackground.style.backgroundColor = "#121212"; // Cor padrão
    }
}

// Configurar o player
function setPlayer(seriesId) {
    const iframe = document.getElementById("videoIframe");
    if (iframe) {
        iframe.src = `${playerBaseURL}${seriesId}/1/1`;
        iframe.style.display = "block";
    } else {
        console.error("Player não encontrado!");
    }
}

// Renderizar informações da série e configurar elementos dinâmicos
async function renderSeriesDetails() {
    const seriesId = getSeriesIdFromUrl();
    if (!seriesId) {
        alert("Série não encontrada!");
        return;
    }

    const seriesDetails = await fetchSeriesDetails(seriesId);
    if (!seriesDetails) {
        alert("Erro ao carregar os detalhes da série.");
        return;
    }

    // Preencher informações na página
    document.getElementById("seriesTitle").textContent = seriesDetails.name || seriesDetails.original_name;
    document.getElementById("seriesDescription").textContent = seriesDetails.overview || "Descrição não disponível.";
    document.getElementById("seriesGenres").textContent = seriesDetails.genres.map(genre => genre.name).join(", ") || "Gênero não disponível";
    document.getElementById("seriesSeasons").textContent = `${seriesDetails.number_of_seasons || "N/A"} temporadas`;
    document.getElementById("seriesEpisodes").textContent = `${seriesDetails.number_of_episodes || "N/A"} episódios`;
    document.getElementById("seriesReleaseDate").textContent = seriesDetails.first_air_date || "Data não disponível.";

    // Configurar o background e o player
    setSeriesBackground(seriesDetails.backdrop_path);
    setPlayer(seriesId);
}

// Inicializar a página
renderSeriesDetails();
