const loggedInEmail = localStorage.getItem("loggedInEmail");
if (!loggedInEmail) {
    window.location.replace("login.html");
}

document.addEventListener("DOMContentLoaded", () => {
    const teacherData = [
        // Source 1
        { email: "yalbo@jlamiami.org", first: "Yosef", last: "Albo" },
        { email: "easseo@jlamiami.org", first: "Eilat", last: "Asseo" },
        { email: "laschliman@jlamiami.org", first: "Lance", last: "Aschliman" },
        { email: "sassraf@jlamiami.org", first: "Shelly", last: "Assraf" },
        { email: "dbaryosef@jlamiami.org", first: "Daphna", last: "Bar Yosef" },
        { email: "mbarandiaran@jlamiami.org", first: "Mikel", last: "Barandiaran" },
        { email: "sbennaim@jlamiami.org", first: "Sapir", last: "Ben Naim" },
        { email: "tbarhama@jlamiami.org", first: "Tsurit", last: "Barhama" },
        { email: "aberkner@jlamiami.org", first: "Allison", last: "Berkner" },
        { email: "cbinsner@jlamiami.org", first: "Carsten", last: "Binsner" },
        { email: "abiscombe@jlamiami.org", first: "Amy", last: "Biscombe" },
        { email: "scahana@jlamiami.org", first: "Shalhevet", last: "Cahana" },
        { email: "ecamarena@jlamiami.org", first: "Elijah", last: "Camarena" },
        { email: "mcarrazana@jlamiami.org", first: "Melissa", last: "Carrazana" },
        { email: "acastillo@jlamiami.org", first: "Alexa", last: "Castillo" },
        { email: "scaudle@jlamiami.org", first: "Susanne", last: "Caudle" },
        { email: "dcerna@jlamiami.org", first: "Darling", last: "Cerna" },
        { email: "mclarke@jlamiami.org", first: "Matthew", last: "Clarke" },
        { email: "vcohen@jlamiami.org", first: "Vered", last: "Cohen" },
        { email: "zcohen@jlamiami.org", first: "Zachary", last: "Cohen" },
        { email: "mdanese@jlamiami.org", first: "Malka", last: "Danese" },
        { email: "merickson@jlamiami.org", first: "Mallory", last: "Erickson" },
        { email: "dernsberger@jlamiami.org", first: "David", last: "Ernsberger" },
        { email: "ofriedman@jlamiami.org", first: "Olivia", last: "Friedman" },
        { email: "rganser@jlamiami.org", first: "RC", last: "Ganser" },
        { email: "jgasner@jlamiami.org", first: "Jenna", last: "Gasner" },
        { email: "lgill@jlamiami.org", first: "Laura", last: "Gill" },
        { email: "zgrant@jlamiami.org", first: "Zoe", last: "Grant" },
        { email: "sgreenfeld@jlamiami.org", first: "Shoshana", last: "Greenfeld" },
        { email: "bgurney@jlamiami.org", first: "Beverly", last: "Gurney" },
        { email: "thendrickson@jlamiami.org", first: "Thomas", last: "Hendrickson" },
        // Source 2
        { email: "bhorowicz@jlamiami.org", first: "Barbie", last: "Horowicz" },
        { email: "khughes@jlamiami.org", first: "Kimberly", last: "Hughes" },
        { email: "jinfante@jlamiami.org", first: "Joaquin", last: "Infante" },
        { email: "pjackson@jlamiami.org", first: "Patrick", last: "Jackson" },
        { email: "ckelleher@jlamiami.org", first: "Christopher", last: "Kelleher" },
        { email: "akellerman@jlamiami.org", first: "Ari", last: "Kellerman" },
        { email: "klapteva@jlamiami.org", first: "Kate", last: "Lapteva" },
        { email: "elevin@jlamiami.org", first: "Eran", last: "Levin" },
        { email: "ylinde@jlamiami.org", first: "Yamit", last: "Linde" },
        { email: "jlitton@jlamiami.org", first: "Jeremy", last: "Litton" },
        { email: "jlopez@jlamiami.org", first: "Johanna", last: "Lopez" },
        { email: "vmartinez@jlamiami.org", first: "Victor", last: "Martinez" },
        { email: "jmelendez@jlamiami.org", first: "Jackeline", last: "Melendez" },
        { email: "smetz@jlamiami.org", first: "Stephanie", last: "Metz" },
        { email: "wmorton@jlamiami.org", first: "William", last: "Morton" },
        { email: "pnandin@jlamiami.org", first: "Philip", last: "Nandin" },
        { email: "tniedosik@jlamiami.org", first: "Theresa", last: "Niedosik" },
        { email: "mostrowski@jlamiami.org", first: "Maxwell", last: "Ostrowski" },
        { email: "apalgon@jlamiami.org", first: "Aliza", last: "Palgon" },
        { email: "jperez@jlamiami.org", first: "Jocelyn", last: "Perez" },
        { email: "gperl@jlamiami.org", first: "Gil", last: "Perl" },
        { email: "dperry@jlamiami.org", first: "Dorit", last: "Perry" },
        { email: "epratt@jlamiami.org", first: "Elisabeth", last: "Pratt" },
        { email: "jsalmeron@jlamiami.org", first: "Jonathan", last: "Salmeron" },
        { email: "dshabtai@jlamiami.org", first: "David", last: "Shabtai" },
        { email: "yshaffer@jlamiami.org", first: "Yechiel", last: "Shaffer" },
        { email: "vshamosh@jlamiami.org", first: "Vanessa", last: "Shamosh" },
        { email: "dstone@jlamiami.org", first: "Debbie", last: "Stone" },
        { email: "dtahan@jlamiami.org", first: "Dorit", last: "Tahan" },
        { email: "nthompson@jlamiami.org", first: "Nikecia", last: "Thompson" },
        { email: "sushinsky@jlamiami.org", first: "Sophia", last: "Ushinsky" },
        // Source 3
        { email: "Iwaxman@jlamiami.org", first: "Lily", last: "Waxman" },
        { email: "swilliams@jlamiami.org", first: "Simone", last: "Williams" },
        { email: "cwerde@jlamiami.org", first: "Chelsea", last: "Werde" },
        { email: "aaguiniga@jlamiami.org", first: "Andrea", last: "Aguiniga" }
    ];

    const currentEmail = localStorage.getItem("loggedInEmail");

if (currentEmail) {
        const officialTeacher = teacherData.find(t => t.email.toLowerCase() === currentEmail.toLowerCase());
        
        const savedProfile = JSON.parse(localStorage.getItem(`${currentEmail.toLowerCase()}-customProfile`));

        if (officialTeacher) {
            const emailSpan = document.getElementById("display-email");
            const firstSpan = document.getElementById("display-first");
            const lastSpan = document.getElementById("display-last");
            const fullNameHeader = document.getElementById("display-full-name");

            if (emailSpan) emailSpan.textContent = officialTeacher.email;

            const firstName = savedProfile ? savedProfile.first : officialTeacher.first;
            const lastName = savedProfile ? savedProfile.last : officialTeacher.last;

            if (firstSpan) firstSpan.textContent = firstName;
            if (lastSpan) lastSpan.textContent = lastName;
            if (fullNameHeader) fullNameHeader.textContent = `${firstName} ${lastName}`;

            const nameDisplay = document.getElementById("teacher-greeting");
            if (nameDisplay) nameDisplay.textContent = `Welcome, ${firstName}!`;
        }
    }
    displayClasses();
    buildLeaderboard();
});

function saveProfileChanges() {
    const currentEmail = localStorage.getItem("loggedInEmail");
    if (!currentEmail) return;

    const newFirst = document.getElementById("display-first").textContent.trim();
    const newLast = document.getElementById("display-last").textContent.trim();

    const profileUpdate = {
        first: newFirst,
        last: newLast
    };

    localStorage.setItem(`${currentEmail.toLowerCase()}-customProfile`, JSON.stringify(profileUpdate));
    
    const fullNameHeader = document.getElementById("display-full-name");
    if (fullNameHeader) fullNameHeader.textContent = `${newFirst} ${newLast}`;

    alert("Profile Updated!");
}

function getTeacherStorageKey() {
    const currentEmail = localStorage.getItem("loggedInEmail");
    return currentEmail ? `${currentEmail.toLowerCase()}-classes` : null;
}

function getLoggedInTeacherName() {
    const first = (localStorage.getItem("firstName") || "").trim();
    const last = (localStorage.getItem("lastName") || "").trim();
    const fullName = `${first} ${last}`.trim();
    return fullName || localStorage.getItem("loggedInEmail") || "Teacher";
}

function saveNewClass() {
    const className = document.getElementById("new-class-name").value;
    const period = document.getElementById("new-class-period").value;
    const storageKey = getTeacherStorageKey();

    if (!storageKey) {
        alert("Error: No logged-in user found.");
        return;
    }

    if (!className || !period) {
        alert("Please fill in all fields");
        return;
    }

    const classObject = { className, teacherName: getLoggedInTeacherName(), period };

    let classes = JSON.parse(localStorage.getItem(storageKey)) || [];
    classes.push(classObject);

    localStorage.setItem(storageKey, JSON.stringify(classes));

    document.getElementById("new-class-name").value = "";
    document.getElementById("new-class-period").value = "";
    
    displayClasses();
}

function displayClasses() {
    const container = document.getElementById("button-container");
    const storageKey = getTeacherStorageKey(); 
    
    if (!container || !storageKey) return;

    const classes = JSON.parse(localStorage.getItem(storageKey)) || [];
    container.innerHTML = ""; 

    classes.forEach((c, index) => {
        const classCard = document.createElement("div");
        classCard.className = "class-card";

        const btn = document.createElement("button");
        btn.className = "class-button";
        btn.innerHTML = `<strong>${c.className}</strong><br>Period: ${c.period}<br>${c.teacherName}`;
        
        btn.onclick = () => {
            const urlName = encodeURIComponent(c.className);
            const urlPeriod = encodeURIComponent(c.period);
            const urlTeacher = encodeURIComponent(c.teacherName); 

        window.location.href = `classview.html?name=${urlName}&period=${urlPeriod}&teacher=${urlTeacher}`;
};

function saveProfileChanges() {
    const currentEmail = localStorage.getItem("loggedInEmail");
    const newFirst = document.getElementById("display-first").textContent;
    const newLast = document.getElementById("display-last").textContent;

    const profileUpdate = {
        first: newFirst,
        last: newLast
    };

    localStorage.setItem(`${currentEmail}-customProfile`, JSON.stringify(profileUpdate));
    alert("Profile Updated!");
}

        const delBtn = document.createElement("button");
        delBtn.className = "delete-btn";
        delBtn.textContent = "×";
        delBtn.onclick = (e) => {
            e.stopPropagation(); 
            deleteClass(index);
        };

        classCard.appendChild(btn);
        classCard.appendChild(delBtn);
        container.appendChild(classCard);
    });
}

function buildLeaderboard() {
    const list = document.getElementById("leaderboard-list");
    const empty = document.getElementById("leaderboard-empty");
    if (!list || !empty) return;

    const counts = {};

    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (!key || !key.startsWith("savedDoc_")) continue;

        try {
            const raw = localStorage.getItem(key);
            const docs = JSON.parse(raw);
            if (!Array.isArray(docs)) continue;

            docs.forEach((doc) => {
                const comments = Array.isArray(doc.comments) ? doc.comments : [];
                comments.forEach((comment) => {
                    const author = comment.author || "Unknown";
                    counts[author] = (counts[author] || 0) + 1;

                    const replies = Array.isArray(comment.replies) ? comment.replies : [];
                    replies.forEach((reply) => {
                        const replyAuthor = reply.author || "Unknown";
                        counts[replyAuthor] = (counts[replyAuthor] || 0) + 1;
                    });
                });
            });
        } catch (e) {
            console.error("Failed to parse annotations for leaderboard", key, e);
        }
    }

    const entries = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    list.innerHTML = "";

    if (entries.length === 0) {
        empty.style.display = "block";
        return;
    }

    empty.style.display = "none";
    entries.slice(0, 10).forEach(([author, count]) => {
        const li = document.createElement("li");
        li.textContent = `${author} — ${count}`;
        list.appendChild(li);
    });
}

function deleteClass(index) {
    const storageKey = getTeacherStorageKey();
    let classes = JSON.parse(localStorage.getItem(storageKey)) || [];
    
    if (confirm("Are you sure you want to delete this class?")) {
        classes.splice(index, 1);
        localStorage.setItem(storageKey, JSON.stringify(classes));
        displayClasses();
    }
}

function clearAllData() {
    const currentEmail = localStorage.getItem("loggedInEmail"); //
    
    if (!currentEmail) return;

    const confirmClear = confirm("Are you sure? This will delete all your classes, your profile picture, and your name edits.");
    
    if (confirmClear) {
        const emailKey = currentEmail.toLowerCase();

        localStorage.removeItem(`${emailKey}-classes`);

        localStorage.removeItem(`${emailKey}-customProfile`);

        localStorage.removeItem(`${emailKey}-profilePic`);

        alert("All data cleared. The page will now refresh.");
        
        window.location.reload();
    }
}

document.addEventListener("DOMContentLoaded", () => {
    displayClasses();

const currentEmail = localStorage.getItem("loggedInEmail");

if (currentEmail) {
    const teacher = teacherData.find(t => t.email.toLowerCase() === currentEmail.toLowerCase());

    if (teacher) {
        const emailSpan = document.getElementById("display-email");
        const firstSpan = document.getElementById("display-first");
        const lastSpan = document.getElementById("display-last");
        const fullNameHeader = document.getElementById("display-full-name");

        if (emailSpan) emailSpan.textContent = teacher.email;
        if (firstSpan) firstSpan.textContent = teacher.first;
        if (lastSpan) lastSpan.textContent = teacher.last;
        
    }
}
});
