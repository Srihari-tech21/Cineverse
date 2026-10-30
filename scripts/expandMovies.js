// ==========================================================
// CineVerse 2.0 - Movie Collection Expansion Script
// Adds comprehensive Telugu Blockbusters, Telugu Classics,
// Tamil, Hindi, Malayalam, and Kannada cinema.
// ==========================================================

const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '..', 'db.json');
const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

// 1. Expand Genres if not present
const currentGenres = db.genres || [];
const newGenreDefs = [
  { id: "6", name: "Romance" },
  { id: "7", name: "Fantasy" },
  { id: "8", name: "Crime" },
  { id: "9", name: "Epic" },
  { id: "10", name: "Adventure" },
  { id: "11", name: "Classic" }
];

newGenreDefs.forEach(g => {
  if (!currentGenres.some(cg => cg.name.toLowerCase() === g.name.toLowerCase())) {
    currentGenres.push(g);
  }
});
db.genres = currentGenres;

// Map genre names to IDs
const genreNameToId = (name) => {
  const g = currentGenres.find(cg => cg.name.toLowerCase() === name.toLowerCase());
  return g ? g.id : "2"; // fallback Action
};

// 2. Collection of Telugu & Indian Films
const moviesToAdd = [
  // --- TELUGU BLOCKBUSTERS ---
  {
    title: "RRR",
    description: "A fearless revolutionary and an officer in the British force, who once shared an unbreakable bond of brotherhood, decide to join forces and wage a heroic battle against oppressive colonial rulers in 1920s India.",
    genre: "Action",
    releaseYear: 2022,
    director: "S. S. Rajamouli",
    cast: ["N. T. Rama Rao Jr.", "Ram Charan", "Alia Bhatt", "Ajay Devgn"],
    duration: 187,
    language: "Telugu",
    industry: "Tollywood",
    featured: true,
    poster: "https://upload.wikimedia.org/wikipedia/en/d/d7/RRR_Poster.jpg",
    backdrop: "https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?w=1600&auto=format&fit=crop&q=80"
  },
  {
    title: "Baahubali 2: The Conclusion",
    description: "When Shiva, the son of Bahubali, learns about his royal heritage, he embarks on an epic quest to find answers and bring justice to the kingdom of Mahishmati while confronting the ruthless Bhallaladeva.",
    genre: "Epic",
    releaseYear: 2017,
    director: "S. S. Rajamouli",
    cast: ["Prabhas", "Rana Daggubati", "Anushka Shetty", "Tamannaah Bhatia", "Ramya Krishna"],
    duration: 167,
    language: "Telugu",
    industry: "Tollywood",
    featured: true,
    poster: "https://upload.wikimedia.org/wikipedia/en/9/93/Baahubali_2_The_Conclusion_poster.jpg",
    backdrop: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1600&auto=format&fit=crop&q=80"
  },
  {
    title: "Baahubali: The Beginning",
    description: "In the ancient kingdom of Mahishmati, an adventurous young man is drawn into an ancient dispute that reveals his royal bloodline and destiny to liberate his people.",
    genre: "Epic",
    releaseYear: 2015,
    director: "S. S. Rajamouli",
    cast: ["Prabhas", "Rana Daggubati", "Tamannaah Bhatia", "Anushka Shetty"],
    duration: 159,
    language: "Telugu",
    industry: "Tollywood",
    featured: false,
    poster: "https://upload.wikimedia.org/wikipedia/en/5/5f/Baahubali_The_Beginning_poster.jpg",
    backdrop: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1600&auto=format&fit=crop&q=80"
  },
  {
    title: "Kalki 2898 AD",
    description: "Set in a dystopian post-apocalyptic future in the city of Kasi, a modern-day avatar of Vishnu descends to protect the world from evil forces led by Supreme Yaskin.",
    genre: "Sci-Fi",
    releaseYear: 2024,
    director: "Nag Ashwin",
    cast: ["Prabhas", "Amitabh Bachchan", "Kamal Haasan", "Deepika Padukone"],
    duration: 181,
    language: "Telugu",
    industry: "Tollywood",
    featured: true,
    poster: "https://upload.wikimedia.org/wikipedia/en/4/4c/Kalki_2898_AD.jpg",
    backdrop: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1600&auto=format&fit=crop&q=80"
  },
  {
    title: "Pushpa: The Rise",
    description: "A laborer named Pushpa Raj rises through the ranks of a red sandalwood smuggling syndicate in the Seshachalam forests, defying law enforcement and rival cartels.",
    genre: "Action",
    releaseYear: 2021,
    director: "Sukumar",
    cast: ["Allu Arjun", "Fahadh Faasil", "Rashmika Mandanna"],
    duration: 179,
    language: "Telugu",
    industry: "Tollywood",
    featured: false,
    poster: "https://upload.wikimedia.org/wikipedia/en/7/75/Pushpa_-_The_Rise_%282021_film%29.jpg",
    backdrop: "https://images.unsplash.com/photo-1511447333015-45b65e60f6d5?w=1600&auto=format&fit=crop&q=80"
  },
  {
    title: "Pushpa 2: The Rule",
    description: "Pushpa Raj expands his sandalwood empire onto a global scale while locked in a fierce, high-stakes psychological and violent duel with SP Bhanwar Singh Shekhawat.",
    genre: "Action",
    releaseYear: 2024,
    director: "Sukumar",
    cast: ["Allu Arjun", "Fahadh Faasil", "Rashmika Mandanna"],
    duration: 195,
    language: "Telugu",
    industry: "Tollywood",
    featured: false,
    poster: "https://upload.wikimedia.org/wikipedia/en/1/11/Pushpa_2_The_Rule.jpg",
    backdrop: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=1600&auto=format&fit=crop&q=80"
  },
  {
    title: "Salaar: Part 1 – Ceasefire",
    description: "In the dystopian city-state of Khansaar, a prince turns to his estranged, exiled childhood friend Deva to claim the throne and quell a brewing revolution.",
    genre: "Action",
    releaseYear: 2023,
    director: "Prashanth Neel",
    cast: ["Prabhas", "Prithviraj Sukumaran", "Shruti Haasan", "Jagapathi Babu"],
    duration: 175,
    language: "Telugu",
    industry: "Tollywood",
    featured: false,
    poster: "https://upload.wikimedia.org/wikipedia/en/a/a6/Salaar_Part_1_%E2%80%93_Ceasefire.jpg",
    backdrop: "https://images.unsplash.com/photo-1533613220915-609f661a6fe1?w=1600&auto=format&fit=crop&q=80"
  },
  {
    title: "Devara: Part 1",
    description: "A fearless sea guardian battles ruthless smuggling clans across perilous waters to protect his coastal village and secure his family's enduring legacy.",
    genre: "Action",
    releaseYear: 2024,
    director: "Koratala Siva",
    cast: ["N. T. Rama Rao Jr.", "Saif Ali Khan", "Janhvi Kapoor", "Prakash Raj"],
    duration: 178,
    language: "Telugu",
    industry: "Tollywood",
    featured: false,
    poster: "https://upload.wikimedia.org/wikipedia/en/b/b3/Devara_Part_1.jpg",
    backdrop: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1600&auto=format&fit=crop&q=80"
  },
  {
    title: "Rangasthalam",
    description: "Chitti Babu, a partially hearing-impaired engineer in 1980s rural Rangasthalam, takes on the ruthless village president to avenge his brother and liberate the village.",
    genre: "Drama",
    releaseYear: 2018,
    director: "Sukumar",
    cast: ["Ram Charan", "Samantha Ruth Prabhu", "Aadhi Pinisetty", "Jagapathi Babu"],
    duration: 179,
    language: "Telugu",
    industry: "Tollywood",
    featured: false,
    poster: "https://upload.wikimedia.org/wikipedia/en/5/5d/Rangasthalam.jpg",
    backdrop: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1600&auto=format&fit=crop&q=80"
  },
  {
    title: "Ala Vaikunthapurramuloo",
    description: "Bantu grows up under the harsh gaze of a critical father, only to discover he was switched at birth with the son of a billionaire and decides to protect his biological family.",
    genre: "Action",
    releaseYear: 2020,
    director: "Trivikram Srinivas",
    cast: ["Allu Arjun", "Pooja Hegde", "Tabu", "Jayaram", "Murali Sharma"],
    duration: 165,
    language: "Telugu",
    industry: "Tollywood",
    featured: false,
    poster: "https://upload.wikimedia.org/wikipedia/en/2/28/Ala_Vaikunthapurramuloo.jpeg",
    backdrop: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1600&auto=format&fit=crop&q=80"
  },
  {
    title: "Magadheera",
    description: "A bike stuntman learns about his past incarnation as an elite warrior in 17th-century Rajasthan and fights to reunite with his reincarnated princess.",
    genre: "Fantasy",
    releaseYear: 2009,
    director: "S. S. Rajamouli",
    cast: ["Ram Charan", "Kajal Aggarwal", "Dev Gill", "Srihari"],
    duration: 166,
    language: "Telugu",
    industry: "Tollywood",
    featured: false,
    poster: "https://upload.wikimedia.org/wikipedia/en/d/dd/Magadheera_poster.jpg",
    backdrop: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=1600&auto=format&fit=crop&q=80"
  },
  {
    title: "Eega",
    description: "A murdered young man reincarnates as a housefly and embarks on a relentless, inventive revenge mission to protect his beloved and destroy his wealthy killer.",
    genre: "Fantasy",
    releaseYear: 2012,
    director: "S. S. Rajamouli",
    cast: ["Nani", "Samantha Ruth Prabhu", "Sudeepa"],
    duration: 145,
    language: "Telugu",
    industry: "Tollywood",
    featured: false,
    poster: "https://upload.wikimedia.org/wikipedia/en/f/f6/Eega_poster.jpg",
    backdrop: "https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?w=1600&auto=format&fit=crop&q=80"
  },
  {
    title: "Jersey",
    description: "A talented but failed cricketer in his late thirties decides to return to the sport despite health hazards to fulfill his young son's dream of getting an Indian jersey.",
    genre: "Drama",
    releaseYear: 2019,
    director: "Gowtam Tinnanuri",
    cast: ["Nani", "Shraddha Srinath", "Sathyaraj", "Ronit Kamra"],
    duration: 157,
    language: "Telugu",
    industry: "Tollywood",
    featured: false,
    poster: "https://upload.wikimedia.org/wikipedia/en/9/91/Jersey_2019_poster.jpg",
    backdrop: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=1600&auto=format&fit=crop&q=80"
  },
  {
    title: "Sita Ramam",
    description: "An orphaned soldier serving in Kashmir receives anonymous love letters from a woman named Sita, sparking an epic romance wrapped in patriotism and sacrifice.",
    genre: "Romance",
    releaseYear: 2022,
    director: "Hanu Raghavapudi",
    cast: ["Dulquer Salmaan", "Mrunal Thakur", "Rashmika Mandanna"],
    duration: 163,
    language: "Telugu",
    industry: "Tollywood",
    featured: false,
    poster: "https://upload.wikimedia.org/wikipedia/en/b/b3/Sita_Ramam.jpg",
    backdrop: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1600&auto=format&fit=crop&q=80"
  },
  {
    title: "Hi Nanna",
    description: "A single father and celebrity photographer weaves imaginative stories about his daughter's missing mother until a compassionate stranger enters their lives.",
    genre: "Drama",
    releaseYear: 2023,
    director: "Shouryuv",
    cast: ["Nani", "Mrunal Thakur", "Kiara Khanna", "Jayaram"],
    duration: 155,
    language: "Telugu",
    industry: "Tollywood",
    featured: false,
    poster: "https://upload.wikimedia.org/wikipedia/en/a/a2/Hi_Nanna_poster.jpg",
    backdrop: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=1600&auto=format&fit=crop&q=80"
  },
  {
    title: "Hanu-Man",
    description: "In the fictional village of Anjanadri, a petty thief gains the supernatural powers of Lord Hanuman through an ancient gem and defends his village from a ruthless modern villain.",
    genre: "Fantasy",
    releaseYear: 2024,
    director: "Prasanth Varma",
    cast: ["Teja Sajja", "Amritha Aiyer", "Varalaxmi Sarathkumar", "Vinay Rai"],
    duration: 158,
    language: "Telugu",
    industry: "Tollywood",
    featured: false,
    poster: "https://upload.wikimedia.org/wikipedia/en/1/1a/Hanu_Man_film_poster.jpg",
    backdrop: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1600&auto=format&fit=crop&q=80"
  },
  {
    title: "Agent Sai Srinivasa Athreya",
    description: "A witty, quirky private detective based in Nellore takes on the suspicious case of an unidentified body found near railway tracks, uncovering a nationwide conspiracy.",
    genre: "Comedy",
    releaseYear: 2019,
    director: "Swaroop RSJ",
    cast: ["Naveen Polishetty", "Shruti Sharma", "Suhas", "Viswanath"],
    duration: 148,
    language: "Telugu",
    industry: "Tollywood",
    featured: false,
    poster: "https://upload.wikimedia.org/wikipedia/en/c/c2/Agent_Sai_Srinivasa_Athreya.jpg",
    backdrop: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1600&auto=format&fit=crop&q=80"
  },
  {
    title: "Mathu Vadalara",
    description: "A frustrated delivery boy desperate for fast money attempts a minor scam during a routine delivery, only to end up trapped in an apartment with a dead body.",
    genre: "Thriller",
    releaseYear: 2019,
    director: "Ritesh Rana",
    cast: ["Sri Simha Koduri", "Satya", "Naresh Agastya", "Brahmaji"],
    duration: 129,
    language: "Telugu",
    industry: "Tollywood",
    featured: false,
    poster: "https://upload.wikimedia.org/wikipedia/en/5/52/Mathu_Vadalara_poster.jpg",
    backdrop: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1600&auto=format&fit=crop&q=80"
  },
  {
    title: "DJ Tillu",
    description: "A flamboyant local Hyderabadi disc jockey falls for a mysterious singer, only to find himself entangled in a murder mystery and extortion scheme.",
    genre: "Comedy",
    releaseYear: 2022,
    director: "Vimal Krishna",
    cast: ["Siddu Jonnalagadda", "Neha Shetty", "Prince Cecil", "Brahmaji"],
    duration: 121,
    language: "Telugu",
    industry: "Tollywood",
    featured: false,
    poster: "https://upload.wikimedia.org/wikipedia/en/5/54/DJ_Tillu.jpg",
    backdrop: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=1600&auto=format&fit=crop&q=80"
  },
  {
    title: "Saripodhaa Sanivaaram",
    description: "A man who channels all his pent-up fury only on Saturdays faces off against a corrupt, sadistic police inspector terrorizing the town of Sokulapalem.",
    genre: "Action",
    releaseYear: 2024,
    director: "Vivek Athreya",
    cast: ["Nani", "S. J. Suryah", "Priyanka Mohan"],
    duration: 174,
    language: "Telugu",
    industry: "Tollywood",
    featured: false,
    poster: "https://upload.wikimedia.org/wikipedia/en/c/cb/Saripodhaa_Sanivaaram.jpg",
    backdrop: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=1600&auto=format&fit=crop&q=80"
  },

  // --- TIMELESS TELUGU CLASSICS ---
  {
    title: "Mayabazar",
    description: "The timeless mythological comedy magnum opus following Lord Krishna, Balarama, and Ghatotkacha as they outwit Duryodhana to unite Sasirekha with Abhimanyu.",
    genre: "Classic",
    releaseYear: 1957,
    director: "K. V. Reddy",
    cast: ["N. T. Rama Rao", "Savitri", "S. V. Ranga Rao", "Akkineni Nageswara Rao"],
    duration: 184,
    language: "Telugu",
    industry: "Tollywood",
    featured: false,
    poster: "https://upload.wikimedia.org/wikipedia/en/b/bb/Mayabazar.jpg",
    backdrop: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=1600&auto=format&fit=crop&q=80"
  },
  {
    title: "Sankarabharanam",
    description: "The celebrated cultural masterpiece about an unyielding Carnatic classical music maestro and a dedicated courtesan's daughter who preserves his artistic tradition.",
    genre: "Classic",
    releaseYear: 1980,
    director: "K. Viswanath",
    cast: ["J. V. Somayajulu", "Manju Bhargavi", "Chandra Mohan"],
    duration: 145,
    language: "Telugu",
    industry: "Tollywood",
    featured: false,
    poster: "https://upload.wikimedia.org/wikipedia/en/f/f6/Sankarabharanam_poster.jpg",
    backdrop: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=1600&auto=format&fit=crop&q=80"
  },
  {
    title: "Sagara Sangamam",
    description: "A brilliant classical dancer struggles with poverty, artistic rejection, and alcoholism while finding a quiet purpose in mentoring a young aspirant.",
    genre: "Classic",
    releaseYear: 1983,
    director: "K. Viswanath",
    cast: ["Kamal Haasan", "Jaya Prada", "Sarath Babu", "S. P. Sailaja"],
    duration: 158,
    language: "Telugu",
    industry: "Tollywood",
    featured: false,
    poster: "https://upload.wikimedia.org/wikipedia/en/d/d1/Sagara_Sangamam.jpg",
    backdrop: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=1600&auto=format&fit=crop&q=80"
  },
  {
    title: "Shiva",
    description: "A fresh college student in Hyderabad stands up against campus goons and political corruption, igniting a cinematic revolution in action storytelling.",
    genre: "Action",
    releaseYear: 1989,
    director: "Ram Gopal Varma",
    cast: ["Nagarjuna", "Amala Akkineni", "Raghuvaran", "Kota Srinivasa Rao"],
    duration: 154,
    language: "Telugu",
    industry: "Tollywood",
    featured: false,
    poster: "https://upload.wikimedia.org/wikipedia/en/3/3f/Siva_poster.jpg",
    backdrop: "https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?w=1600&auto=format&fit=crop&q=80"
  },
  {
    title: "Athadu",
    description: "A professional hired gunman framed for an assassination assumes the identity of a deceased grandson in a warm rural joint family, protecting them from danger.",
    genre: "Action",
    releaseYear: 2005,
    director: "Trivikram Srinivas",
    cast: ["Mahesh Babu", "Trisha Krishnan", "Sonu Sood", "Prakash Raj"],
    duration: 172,
    language: "Telugu",
    industry: "Tollywood",
    featured: false,
    poster: "https://upload.wikimedia.org/wikipedia/en/c/cc/Athadu_poster.jpg",
    backdrop: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=1600&auto=format&fit=crop&q=80"
  },
  {
    title: "Pokiri",
    description: "A ruthless mercenary working for the Hyderabad underworld hides a shocking secret identity while battling rival gangsters and corrupt police officers.",
    genre: "Action",
    releaseYear: 2006,
    director: "Puri Jagannadh",
    cast: ["Mahesh Babu", "Ileana D'Cruz", "Prakash Raj", "Nassar"],
    duration: 161,
    language: "Telugu",
    industry: "Tollywood",
    featured: false,
    poster: "https://upload.wikimedia.org/wikipedia/en/a/ad/Pokiri_poster.jpg",
    backdrop: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=1600&auto=format&fit=crop&q=80"
  },
  {
    title: "Bommarillu",
    description: "A young man suffocated by his overbearing father's micromanagement finds courage to speak up after falling in love with a free-spirited woman.",
    genre: "Romance",
    releaseYear: 2006,
    director: "Bhaskar",
    cast: ["Siddharth", "Genelia D'Souza", "Prakash Raj", "Jayasudha"],
    duration: 170,
    language: "Telugu",
    industry: "Tollywood",
    featured: false,
    poster: "https://upload.wikimedia.org/wikipedia/en/5/52/Bommarillu.jpg",
    backdrop: "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=1600&auto=format&fit=crop&q=80"
  },
  {
    title: "Nuvvu Naaku Nachav",
    description: "A witty, unemployed young man visits his father's friend's house in Hyderabad and unintentionally wins the heart of a bride-to-be, sparking hilarious family chaos.",
    genre: "Comedy",
    releaseYear: 2001,
    director: "K. Vijaya Bhaskar",
    cast: ["Venkatesh", "Aarthi Agarwal", "Prakash Raj", "Brahmanandam"],
    duration: 176,
    language: "Telugu",
    industry: "Tollywood",
    featured: false,
    poster: "https://upload.wikimedia.org/wikipedia/en/6/66/Nuvvu_Naaku_Nachav.jpg",
    backdrop: "https://images.unsplash.com/photo-1514565131-fce0801e5785?w=1600&auto=format&fit=crop&q=80"
  },

  // --- TAMIL CINEMA ---
  {
    title: "Vikram",
    description: "A covert commander leads a black-ops squad on the trail of a masked vigilante and a ruthless drug syndicate running a mega cartel.",
    genre: "Action",
    releaseYear: 2022,
    director: "Lokesh Kanagaraj",
    cast: ["Kamal Haasan", "Vijay Sethupathi", "Fahadh Faasil", "Suriya"],
    duration: 174,
    language: "Tamil",
    industry: "Kollywood",
    featured: false,
    poster: "https://upload.wikimedia.org/wikipedia/en/9/93/Vikram_2022_poster.jpg",
    backdrop: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=1600&auto=format&fit=crop&q=80"
  },
  {
    title: "Kaithi",
    description: "A recently released prisoner seeking to meet his estranged daughter agrees to drive a truck full of unconscious poisoned police officers through a gauntlet of gangsters.",
    genre: "Thriller",
    releaseYear: 2019,
    director: "Lokesh Kanagaraj",
    cast: ["Karthi", "Narain", "Arjun Das", "George Maryan"],
    duration: 145,
    language: "Tamil",
    industry: "Kollywood",
    featured: false,
    poster: "https://upload.wikimedia.org/wikipedia/en/d/d6/Kaithi_poster.jpg",
    backdrop: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1600&auto=format&fit=crop&q=80"
  },
  {
    title: "Maharaja",
    description: "A quiet barber embarks on an unyielding quest to find his stolen dustbin 'Lakshmi', leading the police through a maze of unexpected secrets and dark justice.",
    genre: "Thriller",
    releaseYear: 2024,
    director: "Nithilan Saminathan",
    cast: ["Vijay Sethupathi", "Anurag Kashyap", "Mamta Mohandas", "Natarajan Subramaniam"],
    duration: 141,
    language: "Tamil",
    industry: "Kollywood",
    featured: false,
    poster: "https://upload.wikimedia.org/wikipedia/en/7/7b/Maharaja_2024_film_poster.jpg",
    backdrop: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=1600&auto=format&fit=crop&q=80"
  },
  {
    title: "Soorarai Pottru",
    description: "Nedumaaran Rajangam sets out to make the common man fly and takes on the world's most capital-intensive industry with the help of his friends and family.",
    genre: "Drama",
    releaseYear: 2020,
    director: "Sudha Kongara",
    cast: ["Suriya", "Aparna Balamurali", "Paresh Rawal", "Mohan Babu"],
    duration: 153,
    language: "Tamil",
    industry: "Kollywood",
    featured: false,
    poster: "https://upload.wikimedia.org/wikipedia/en/e/eb/Soorarai_Pottru_poster.jpg",
    backdrop: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1600&auto=format&fit=crop&q=80"
  },

  // --- HINDI CINEMA ---
  {
    title: "3 Idiots",
    description: "Two friends search for their long-lost college companion while reflecting on their hilarious and life-changing engineering student days.",
    genre: "Comedy",
    releaseYear: 2009,
    director: "Rajkumar Hirani",
    cast: ["Aamir Khan", "R. Madhavan", "Sharman Joshi", "Kareena Kapoor"],
    duration: 170,
    language: "Hindi",
    industry: "Bollywood",
    featured: false,
    poster: "https://upload.wikimedia.org/wikipedia/en/d/df/3_idiots_poster.jpg",
    backdrop: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1600&auto=format&fit=crop&q=80"
  },
  {
    title: "12th Fail",
    description: "Based on the true story of Manoj Kumar Sharma, who overcomes extreme poverty, academic failure, and hardship to become an Indian Police Service officer.",
    genre: "Drama",
    releaseYear: 2023,
    director: "Vidhu Vinod Chopra",
    cast: ["Vikrant Massey", "Medha Shankr", "Anant V Joshi", "Priiyanshu Chatterjee"],
    duration: 147,
    language: "Hindi",
    industry: "Bollywood",
    featured: false,
    poster: "https://upload.wikimedia.org/wikipedia/en/f/f2/12th_Fail_poster.jpg",
    backdrop: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=1600&auto=format&fit=crop&q=80"
  },
  {
    title: "Andhadhun",
    description: "A seemingly blind pianist unintentionally becomes embroiled in the murder of a former film star after agreeing to perform a private concert in his home.",
    genre: "Thriller",
    releaseYear: 2018,
    director: "Sriram Raghavan",
    cast: ["Ayushmann Khurrana", "Tabu", "Radhika Apte", "Anil Dhawan"],
    duration: 139,
    language: "Hindi",
    industry: "Bollywood",
    featured: false,
    poster: "https://upload.wikimedia.org/wikipedia/en/4/47/Andhadhun_poster.jpg",
    backdrop: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=1600&auto=format&fit=crop&q=80"
  },
  {
    title: "Zindagi Na Milegi Dobara",
    description: "Three childhood friends take an adventurous bachelor road trip across Spain, facing their deepest fears, past regrets, and discovering what truly matters.",
    genre: "Drama",
    releaseYear: 2011,
    director: "Zoya Akhtar",
    cast: ["Hrithik Roshan", "Farhan Akhtar", "Abhay Deol", "Katrina Kaif", "Kalki Koechlin"],
    duration: 155,
    language: "Hindi",
    industry: "Bollywood",
    featured: false,
    poster: "https://upload.wikimedia.org/wikipedia/en/3/3d/Zindagi_Na_Milegi_Dobara_poster.jpg",
    backdrop: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1600&auto=format&fit=crop&q=80"
  },

  // --- MALAYALAM CINEMA ---
  {
    title: "Manjummel Boys",
    description: "A group of close-knit friends from a small town in Kerala embark on a vacation to Kodaikanal, where one of them falls into the notoriously treacherous Guna Caves.",
    genre: "Adventure",
    releaseYear: 2024,
    director: "Chidambaram",
    cast: ["Soubin Shahir", "Sreenath Bhasi", "Balu Varghese", "Ganapathi"],
    duration: 135,
    language: "Malayalam",
    industry: "Mollywood",
    featured: false,
    poster: "https://upload.wikimedia.org/wikipedia/en/e/eb/Manjummel_Boys_poster.jpg",
    backdrop: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1600&auto=format&fit=crop&q=80"
  },
  {
    title: "Drishyam",
    description: "A devoted cable TV operator orchestrates an elaborate alibi to shield his family from prosecution after an accidental killing.",
    genre: "Thriller",
    releaseYear: 2013,
    director: "Jeethu Joseph",
    cast: ["Mohanlal", "Meena", "Asha Sarath", "Siddique"],
    duration: 160,
    language: "Malayalam",
    industry: "Mollywood",
    featured: false,
    poster: "https://upload.wikimedia.org/wikipedia/en/d/da/Drishyam_film_poster.jpg",
    backdrop: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1600&auto=format&fit=crop&q=80"
  },
  {
    title: "Aavesham",
    description: "Three college students who arrive in Bangalore face brutal ragging from seniors and seek out a quirky local gangster named Ranga for protection.",
    genre: "Comedy",
    releaseYear: 2024,
    director: "Jithu Madhavan",
    cast: ["Fahadh Faasil", "Hipzster", "Mithun Jai Shankar", "Sajin Gopu"],
    duration: 158,
    language: "Malayalam",
    industry: "Mollywood",
    featured: false,
    poster: "https://upload.wikimedia.org/wikipedia/en/0/05/Aavesham.jpg",
    backdrop: "https://images.unsplash.com/photo-1514565131-fce0801e5785?w=1600&auto=format&fit=crop&q=80"
  },
  {
    title: "Kumbalangi Nights",
    description: "Four dysfunctional brothers living in a decaying home in Kumbalangi find solace and redemption through love, brotherhood, and compassion.",
    genre: "Drama",
    releaseYear: 2019,
    director: "Madhu C. Narayanan",
    cast: ["Soubin Shahir", "Shane Nigam", "Fahadh Faasil", "Sreenath Bhasi"],
    duration: 135,
    language: "Malayalam",
    industry: "Mollywood",
    featured: false,
    poster: "https://upload.wikimedia.org/wikipedia/en/4/4b/Kumbalangi_Nights_poster.jpg",
    backdrop: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1600&auto=format&fit=crop&q=80"
  },

  // --- KANNADA CINEMA ---
  {
    title: "Kantara",
    description: "A rebel hunter from a coastal Karnataka tribal community becomes chosen by the divine forest spirit Bhoota Kola to protect his sacred lands from a greedy feudal lord.",
    genre: "Epic",
    releaseYear: 2022,
    director: "Rishab Shetty",
    cast: ["Rishab Shetty", "Sapthami Gowda", "Kishore", "Achyuth Kumar"],
    duration: 148,
    language: "Kannada",
    industry: "Sandalwood",
    featured: false,
    poster: "https://upload.wikimedia.org/wikipedia/en/8/84/Kantara_poster.jpeg",
    backdrop: "https://images.unsplash.com/photo-1448375240586-882707db888b?w=1600&auto=format&fit=crop&q=80"
  },
  {
    title: "K.G.F: Chapter 1",
    description: "Rocky, a fierce young assassin seeking to fulfill his dying mother's promise of absolute wealth and power, infiltrates the slave mines of Kolar Gold Fields.",
    genre: "Action",
    releaseYear: 2018,
    director: "Prashanth Neel",
    cast: ["Yash", "Srinidhi Shetty", "Anant Nag", "Ramachandra Raju"],
    duration: 156,
    language: "Kannada",
    industry: "Sandalwood",
    featured: false,
    poster: "https://upload.wikimedia.org/wikipedia/en/c/cc/K.G.F_Chapter_1_poster.jpg",
    backdrop: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1600&auto=format&fit=crop&q=80"
  },
  {
    title: "777 Charlie",
    description: "Dharma, a reclusive and lonely factory worker leading a monotonous life, undergoes a life-altering transformation when an energetic Labrador pup wanders into his world.",
    genre: "Adventure",
    releaseYear: 2022,
    director: "Kiranraj K.",
    cast: ["Charlie (Labrador)", "Rakshit Shetty", "Sangeetha Sringeri", "Raj B. Shetty"],
    duration: 164,
    language: "Kannada",
    industry: "Sandalwood",
    featured: false,
    poster: "https://upload.wikimedia.org/wikipedia/en/c/cb/777_Charlie_poster.jpg",
    backdrop: "https://images.unsplash.com/photo-1534361960057-19889db9621e?w=1600&auto=format&fit=crop&q=80"
  }
];

// Add movies without duplicate titles
let nextId = 100;
let addedCount = 0;

moviesToAdd.forEach(movie => {
  const exists = db.movies.some(m => m.title.toLowerCase() === movie.title.toLowerCase());
  if (!exists) {
    const genreId = genreNameToId(movie.genre);
    db.movies.push({
      id: String(nextId++),
      title: movie.title,
      description: movie.description,
      genreId: genreId,
      releaseYear: movie.releaseYear,
      director: movie.director,
      cast: movie.cast,
      duration: movie.duration,
      language: movie.language,
      industry: movie.industry,
      featured: Boolean(movie.featured),
      poster: movie.poster,
      backdrop: movie.backdrop
    });
    addedCount++;
  }
});

// Also make sure all existing movies have industry & language set properly
db.movies.forEach(m => {
  if (!m.language) m.language = "English";
  if (!m.industry) {
    if (m.language === "Telugu") m.industry = "Tollywood";
    else if (m.language === "Tamil") m.industry = "Kollywood";
    else if (m.language === "Hindi") m.industry = "Bollywood";
    else if (m.language === "Malayalam") m.industry = "Mollywood";
    else if (m.language === "Kannada") m.industry = "Sandalwood";
    else m.industry = "Hollywood";
  }
});

// 3. Add genuine reviews for Indian and Telugu cinema so average ratings and distributions are populated
const reviewsToAdd = [
  { movieId: "100", reviewerName: "Kalyan Varma", rating: 5, comment: "RRR is pure cinematic euphoria! Rajamouli proves once again why Indian cinema is unmatched in scale and raw emotion.", date: "2024-08-12" },
  { movieId: "100", reviewerName: "Pooja Reddy", rating: 5, comment: "The interval scene alone is worth watching ten times. Ram Charan and NTR gave career-best performances.", date: "2024-09-01" },
  { movieId: "101", reviewerName: "Ramesh Babu", rating: 5, comment: "Why Kattappa killed Baahubali was answered with royal grandeur. Prabhas is an absolute king on screen.", date: "2024-07-20" },
  { movieId: "103", reviewerName: "Siddharth Rao", rating: 5, comment: "Nag Ashwin has created a genuine sci-fi epic rooted in Mahabharata lore. Amitabh Bachchan as Ashwatthama is goosebumps!", date: "2024-07-05" },
  { movieId: "104", reviewerName: "Arun Kumar", rating: 5, comment: "Allu Arjun's swag in Pushpa is legendary. Sukumar's detailing of the Seshachalam forest world is top notch.", date: "2024-06-18" },
  { movieId: "108", reviewerName: "Harish Chandra", rating: 5, comment: "Rangasthalam is an emotional triumph. Ram Charan's acting as Chitti Babu is unforgettable.", date: "2024-05-14" },
  { movieId: "112", reviewerName: "Ananya Sharma", rating: 5, comment: "Jersey brings tears every single time. Nani makes Arjun's struggle and unconditional fatherly love feel so real.", date: "2024-04-10" },
  { movieId: "113", reviewerName: "Divya Nair", rating: 5, comment: "The poetic love story of Ram and Sita. Vishal Chandrashekhar's music and Kashmir visuals are breathtaking.", date: "2024-08-22" },
  { movieId: "115", reviewerName: "Vikram Teja", rating: 5, comment: "Hanu-Man took everyone by surprise with its VFX, heart, and goosebumps-inducing climax.", date: "2024-02-15" },
  { movieId: "120", reviewerName: "K. Satyanarayana", rating: 5, comment: "Mayabazar is the greatest film in the history of Telugu cinema. Every song and dialogue is immortal.", date: "2024-01-01" },
  { movieId: "128", reviewerName: "Mani Kandan", rating: 5, comment: "Vikram is a non-stop adrenaline rush. Kamal Haasan + Lokesh Kanagaraj = perfection.", date: "2024-06-03" },
  { movieId: "132", reviewerName: "Rohit Verma", rating: 5, comment: "12th Fail restored my faith in cinema. Re-start! Vikrant Massey deserves every award possible.", date: "2024-03-25" },
  { movieId: "136", reviewerName: "Jithin Raj", rating: 5, comment: "Manjummel Boys is the gold standard for survival thrillers in Indian cinema. The emotional payoff is unreal.", date: "2024-04-19" },
  { movieId: "140", reviewerName: "Rakesh Gowda", rating: 5, comment: "Kantara connects deeply with our folklore and roots. The climax performance by Rishab Shetty is divine.", date: "2024-05-30" }
];

let reviewNextId = 1000;
reviewsToAdd.forEach(r => {
  if (!db.reviews.some(cr => cr.movieId === r.movieId && cr.reviewerName === r.reviewerName)) {
    db.reviews.push({
      id: String(reviewNextId++),
      movieId: r.movieId,
      reviewerName: r.reviewerName,
      rating: r.rating,
      comment: r.comment,
      date: r.date
    });
  }
});

fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf8');

console.log(`Success! Added ${addedCount} new movies. Total movies now: ${db.movies.length}. Total reviews: ${db.reviews.length}. Total genres: ${db.genres.length}.`);
