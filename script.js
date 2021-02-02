let allProjs;
let projRecord = [];
let techList = [];

function getStyle(oElm, strCssRule) {
  var strValue = "";
  if (document.defaultView && document.defaultView.getComputedStyle) {
    strValue = document.defaultView
      .getComputedStyle(oElm, "")
      .getPropertyValue(strCssRule);
  } else if (oElm.currentStyle) {
    strCssRule = strCssRule.replace(/\-(\w)/g, function (strMatch, p1) {
      return p1.toUpperCase();
    });
    strValue = oElm.currentStyle[strCssRule];
  }
  return strValue;
}

function loadProjects() {
  data.projects.sort(
    (a, b) => parseFloat(Date.parse(b.date)) - parseFloat(Date.parse(a.date))
  );
  let text = "";
  for (let i = 0; i < data.projects.length; i++) {
    let proj = data.projects[i];
    let newDate = new Date(proj.date);
    text += `<div class='projBlock'>`;
    if (proj.img != null) {
      if (proj.url != null) {
        text += `<a href="${proj.url}"><img src="img/${proj.img}" alt="${proj.name}"></a>`;
      } else {
        text += `<img src="img/${proj.img}" alt="${proj.name}">`;
      }
    }
    text += `<div class="blockWrap"><h3>`;
    if (proj.url != null) {
      text += `<a href="${proj.url}">${proj.name}</a>`;
    } else {
      text += proj.name;
    }
    text += `</h3>
                <i>${
                  newDate.getMonth() + 1
                }/${newDate.getFullYear().toString().substr(-2)}</i>
            <p>${proj.description}</p>
            <span><b>Technologies Used:</b> `;
    for (let z = 0; z < proj.tech.length; z++) {
      text += proj.tech[z];
      if (z != proj.tech.length - 1) {
        text += ", ";
      }
      //put tech in tech array
      if (techList.indexOf(proj.tech[z]) < 0) {
        techList.push(proj.tech[z]);
      }
    }
    text += `</span>`;
    if (proj.repo != null) {
      text += `<a href="${proj.repo}" class="repoLink">Repository</a>`;
    }
    text += `</div></div>`;
  }
  //pump in and transition elements
  document.getElementById("projList").innerHTML = text;
  TweenMax.staggerFrom(".projBlock", 0.75, { opacity: 0, delay: 0.5 }, 0.1);

  allProjs = document.querySelectorAll(".projBlock");
  allProjs.forEach(logPlace);

  //filter
  let optionBar = document.getElementById("theBar");
  techList.sort();
  for (let a = 0; a < techList.length; a++) {
    var option = document.createElement("option");
    option.text = techList[a];
    optionBar.add(option);
  }
}

function checkSidebar() {
  if (window.innerWidth <= 950) {
    let infoBoxHeight = document.getElementById("infoBox").offsetHeight;
    let sidebarHeight = document.getElementById("sideBar").offsetHeight;
    let padding = parseInt(
      getStyle(document.getElementById("sideBar"), "padding-top")
    );
    let trueInfoHeight = infoBoxHeight + padding;
    //console.log(`infoBox: ${trueInfoHeight}, sideBar: ${sidebarHeight}`)
    if (trueInfoHeight >= 150) {
      document.getElementById("sideBar").style.height =
        trueInfoHeight + padding + "px";
      document.getElementById("content").style.marginTop =
        trueInfoHeight + padding + "px";
      document.getElementById("content").style.height =
        trueInfoHeight + padding + "px";
    } else if (trueInfoHeight < 150) {
      document.getElementById("sideBar").style.height = null;
      document.getElementById("content").style.marginTop = null;
      document.getElementById("content").style.height = null;
    }
  } else {
    document.getElementById("sideBar").style.height = "100vh";
    document.getElementById("content").style.marginTop = "0";
    document.getElementById("content").style.height = "100vh";
  }
}

loadProjects();
checkSidebar();
window.addEventListener("resize", checkSidebar);
window.addEventListener("resize", layout);

function checkPlace(item, index) {
  let boundBox = allProjs[index].getBoundingClientRect();
  let lastTop = projRecord[index].y;
  let lastLeft = projRecord[index].x;
  let newTop = boundBox.y;
  let newLeft = boundBox.x;

  if (lastTop !== newTop || lastLeft !== newLeft) {
    //console.log(`last top: ${lastTop}, new top: ${newTop} // last left: ${lastLeft}, new left: ${newLeft}`)

    let yCo = lastTop - newTop;
    let xCo = lastLeft - newLeft;
    if (projRecord[index].moving == false) {
      projRecord[index].moving = true;
      TweenMax.fromTo(
        item,
        0.5,
        { top: yCo, left: xCo },
        {
          top: 0,
          left: 0,
          ease: Power1.easeInOut,
          onComplete: logPlace,
          onCompleteParams: [item, index],
        }
      );
    }
  }
}

function logPlace(item, index) {
  let boundBox = allProjs[index].getBoundingClientRect();
  projRecord[index] = { x: boundBox.x, y: boundBox.y, moving: false };
}

function layout() {
  allProjs.forEach(checkPlace);
}

function filterSet(changed) {
  for (let i = 0; i < data.projects.length; i++) {
    console.log(changed.value);
    //console.log(data.projects[i].tech)
    if (
      data.projects[i].tech.includes(changed.value) == false &&
      changed.value != "all"
    ) {
      allProjs[i].classList.add("hidden");
    } else {
      allProjs[i].classList.remove("hidden");
    }
  }
  layout();
}
