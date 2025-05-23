const search = document.getElementById("search");
const searchInput = document.getElementById("search");
let debounceTimeout;
let isRequestPending = false;
var erudaScript; 

/*
const splash = [
	"shuttle is so hot",
	"Go ahead, browse your ex's social media profiles.",
	"We take your online privacy as seriously as your ex takes stalking your social media profiles.",
	"Check our our github.",
	"Shhh... we won't tell anyone you're here.",
	"Join our discord for more links.",
	"Imagine not using shuttle",
	"No website is out of your reach now.",
	"Your online freedom, our promise.",
	"Because a blocked internet, is no internet at all.",
	"Site blocked? Not on our watch!",
	"What site r u going on.",
	"Now 99% less skiddy... wait who put that there??? :<",
	"try shittle toilet services"
];

window.addEventListener("load", () => {
	document.querySelector("#splash").innerHTML = splash[Math.floor(Math.random() * (splash.length))];
});
*/

window.addEventListener("DOMContentLoaded", () => {
	const link = atob(window.location.hash.slice(1));
	if (link) go(link);
});

document.getElementById("form").addEventListener("submit", (event) => {
	event.preventDefault();
	go(search.value);
});

async function fetchResults(searchText) {
	try {
		const response = await bare.fetch(`https://duckduckgo.com/ac/?q=${encodeURIComponent(searchText)}`);
		const data = await response.json();
		isRequestPending = false;
		if (!Array.isArray(data)) {
			console.log(`Error: Invalid response format. Expected Array (got ${typeof data})`);
			return;
		}
		const suggestions = document.getElementById("suggestions");
		suggestions.innerHTML = "";
		for(const result of (data.map(r => r.phrase))) {
			const suggestionItem = document.createElement("div");
			const suggestionLink = document.createElement("a");
			suggestionItem.classList = ["suggestions"];

			const boldText = result.includes(searchText) ? `<strong>${searchText}</strong>` : searchText;
			suggestionLink.innerHTML = result.replace(searchText, boldText);

			suggestionLink.addEventListener("click", (event) => {
				event.preventDefault();
				searchurl(result);
			});
			suggestionItem.appendChild(suggestionLink);
			suggestions.appendChild(suggestionItem);
		}
	} catch (e) {
		isRequestPending = false;
		console.error(e);
	}
}

searchInput.addEventListener("input", (event) => {
	clearTimeout(debounceTimeout);
	const searchText = event.target.value;

	debounceTimeout = setTimeout(() => {
		if (searchText.length >= 1) {
			fetchResults(searchText)
		}
		if (searchText.length < 1) {
			document.getElementById("suggestions").style.display = "none";
		} else {
			document.getElementById("suggestions").style.display = "block";
		}
	}, 100);
});

const form = document.getElementById("form");

searchInput.addEventListener("input", (event) => {
	const searchText = event.target.value;

	if (searchText.trim().length > 0) {
		form.focus();
	}
});

function erudaToggle() {
	var elem = document.getElementById("ifr");
	
	if (erudaScript) {
		elem.contentWindow.eruda.destroy(); 
		elem.removeChild(erudaScript);
		erudaScript = undefined;
	} else {
		erudaScript = document.createElement("script");
		erudaScript.src = "https://cdn.jsdelivr.net/npm/eruda";
		elem.contentDocument.body.appendChild(erudaScript);
		erudaScript.onload = function() {
			elem.contentWindow.eruda.init();
			elem.contentWindow.eruda.show();
		};
	}
}

grecaptcha.ready(function () {
  grecaptcha.execute('6Lc5lEErAAAAAD4k34ni0EXJZ-XLB8PY27F2gGII', { action: 'submit' }).then(function (token) {
    console.log('Token:', token); // デバッグ用。あとで消してもOK

    // サーバーへトークンを送信して検証
    fetch('/verify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ token: token })
    })
      .then(response => response.json())
      .then(data => {
        console.log('Verification result:', data); // 成功なら data.success === true

        if (data.success) {
          console.log('reCAPTCHA OK！');
          // ここでフォーム有効化やユーザー処理などができる
        } else {
          alert('reCAPTCHA 検証に失敗しました。');
        }
      })
      .catch(error => {
        console.error('Error verifying reCAPTCHA:', error);
      });
  });
});

document.getElementById("form").addEventListener("submit", async (e) => {
  e.preventDefault(); // フォームの通常送信を止める

  grecaptcha.ready(async () => {
    const token = await grecaptcha.execute("6Lc5lEErAAAAAD4k34ni0EXJZ-XLB8PY27F2gGII", { action: "submit" });

    // トークンをサーバーに送信して検証する
    const res = await fetch("/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    });

    const data = await res.json();

    if (data.success) {
      console.log("reCAPTCHA認証成功！");
      // ここで通常の検索処理とか続けてOK
      // 例: document.getElementById("form").submit(); とか
    } else {
      alert("reCAPTCHA認証に失敗しました。もう一度試してください。");
    }
  });
});
