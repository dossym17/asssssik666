const party = [
  { room: "Balcony", floor: 2, guests: [
    { name: "Aigerim", color: "green",  time: "20:45", aitu: true,  things: ["cup", "crumbs"] },
    { name: "Aliya",   color: "black",  time: "21:15", aitu: false, things: ["phone", "cup"] },
    { name: "Madina",  color: "green",  time: "22:10", aitu: false, things: ["phone", "bag", "crumbs"] },
    { name: "Ivan",    color: "black",  time: "20:10", aitu: true,  things: ["cup"] }
  ]},
  { room: "Hall", floor: 2, guests: [
    { name: "Arman",   color: "yellow", time: "20:35", aitu: false, things: ["bag", "glasses"] },
    { name: "Sophia",  color: "purple", time: "21:20", aitu: true,  things: ["phone"] },
    { name: "Dias",    color: "green",  time: "19:45", aitu: true,  things: [] },
    { name: "Bekzat",  color: "purple", time: "20:55", aitu: false, things: ["bag", "cup", "crumbs"] },
    { name: "Aruzhan", color: "black",  time: "21:50", aitu: true,  things: ["phone"] },
    { name: "Saule",   color: "green",  time: "21:25", aitu: false, things: ["glasses"] }
  ]},
  { room: "Kitchen", floor: 1, guests: [
    { name: "Nurlan",  color: "red",    time: "19:40", aitu: true,  things: ["phone", "cup"] },
    { name: "Emma",    color: "black",  time: "20:15", aitu: false, things: ["bag"] },
    { name: "Timur",   color: "green",  time: "21:05", aitu: true,  things: ["phone", "bag", "crumbs"] },
    { name: "Sergey",  color: "yellow", time: "20:50", aitu: false, things: [] },
    { name: "Yerlan",  color: "red",    time: "21:40", aitu: true,  things: ["glasses", "phone"] },
    { name: "Kamila",  color: "black",  time: "20:05", aitu: false, things: ["cup"] }
  ]},
  { room: "Living room", floor: 1, guests: [
    { name: "Daniel",  color: "blue",   time: "19:55", aitu: false, things: ["glasses"] },
    { name: "Zarina",  color: "green",  time: "22:30", aitu: false, things: ["bag", "phone", "crumbs"] }, // Исправлено время на 22:30
    { name: "Natasha", color: "yellow", time: "20:30", aitu: true,  things: [] },
    { name: "Askar",   color: "black",  time: "21:00", aitu: true,  things: ["phone"] },
    { name: "Inkar",   color: "purple", time: "20:20", aitu: false, things: ["bag"] }
  ]}
];

const ICONS = { phone: "📱", glasses: "👓", bag: "👜", cup: "☕", crumbs: "🍰" };

function makeCard(g) {
  const $card = $("<div>")
    .addClass("guest")
    .addClass(g.things.join(" "))
    .toggleClass("aitu", g.aitu)
    .attr({ "data-name": g.name, "data-color": g.color, "data-time": g.time });

  const $avatar = $("<img>")
    .addClass("avatar")
    .attr("src", "https://api.dicebear.com/9.x/open-peeps/svg?seed=" + g.name)
    .attr("alt", g.name);

  const $badge = $("<span>").addClass("badge").text("🎓");
  const $name = $("<div>").addClass("name").text(g.name);
  const $time = $("<div>").addClass("time").text("🕒 " + g.time);
  const $things = $("<div>").addClass("things")
    .text(g.things.map(t => ICONS[t]).join(" "));

  return $card.append($avatar, $badge, $name, $time, $things);
}

function buildParty() {
  cancelMoves(); 
  const $house = $("#house").empty();

  [2, 1].forEach(function (floorNum) {
    const $floor = $("<div>").addClass("floor").attr("data-floor", floorNum);
    $floor.append($("<div>").addClass("floor-label").text("FLOOR " + floorNum));

    const $rooms = $("<div>").addClass("rooms");
    party.filter(r => r.floor === floorNum).forEach(function (r) {
      const $room = $("<div>").addClass("room").attr("data-room", r.room);
      $room.append($("<div>").addClass("room-head")
        .append($("<h2>").text(r.room))
        .append($("<button>").addClass("sort-btn").text("Sort by time")));

      const $guests = $("<div>").addClass("guests");
      r.guests.forEach(g => $guests.append(makeCard(g)));

      $rooms.append($room.append($guests));
    });

    $house.append($floor.append($rooms));
  });
}

/* ---------- КЕЙСЫ ---------- */
const cases = [
  { title: "Who is in the hall?",
    find: () => $(".room[data-room='Hall'] .guest") },

  { title: "Who is dressed in yellow or purple?",
    find: () => $(".guest[data-color='yellow'], .guest[data-color='purple']") },

  { title: "Which AITU students are upstairs?",
    find: () => $(".floor[data-floor='2'] .guest.aitu") },

  { title: "Who has glasses or a bag?",
    find: () => $(".guest.glasses, .guest.bag") },

  { title: "Who came with nothing at all?",
    find: () => $(".guest").not(".phone, .glasses, .bag, .cup, .crumbs") },

  { title: "Who has a phone but no bag?",
    find: () => $(".guest.phone").not(".bag") },

  { title: "Who arrived between 20:30 and 21:00?",
    find: () => $(".guest").filter(function () {
      const t = $(this).attr("data-time");
      return t >= "20:30" && t <= "21:00";
    }) },

  { title: "Who arrived after 21:00 and is not AITU?",
    find: () => $(".guest").not(".aitu").filter(function () {
      return $(this).attr("data-time") > "21:00";
    }) },

  { title: "Who stands right next to Askar?",
    find: () => $(".guest[data-name='Askar']").prev().add(
                $(".guest[data-name='Askar']").next()) },

  { title: "Who stands last in each room?",
    find: () => $(".guest:last-child") },

  { title: "Who stands third in each room?",
    find: () => $(".guest:nth-child(3)") },

  { title: "Who stands after Timur in his room?",
    find: () => $(".guest[data-name='Timur']").nextAll() },

  { title: "Who stands right before someone in black?",
    find: () => $(".guest[data-color='black']").prev() },

  { title: "In which room is Aruzhan?",
    find: () => $(".guest[data-name='Aruzhan']").closest(".room") },

  { title: "Which rooms have fewer than 6 guests?",
    find: () => $(".room").filter(function () {
      return $(this).find(".guest").length < 6;
    }) },

  // Исправлено: поддержка нескольких комнат без вложенного :has()
  { title: "Which rooms have a cup but no glasses?",
    find: () => $(".room").has(".guest.cup").not($(".room").has(".guest.glasses")) },

  // Исправлено: корректный возврат DOM-элементов
  { title: "Who came first to each room?",
    find: () => $(".room").map(function () {
      return $(this).find(".guest").get().sort(function (a, b) {
        return $(a).attr("data-time").localeCompare($(b).attr("data-time"));
      })[0];
    }) },

  { title: "Miras comes and stands between Askar and Inkar",
    find: () => makeCard({ name: "Miras", color: "blue", time: "21:20",
                            aitu: true, things: ["phone"] })
                  .hide()
                  .insertAfter(".guest[data-name='Askar']")
                  .fadeIn(800) },

  { title: "Natasha goes home",
    noJump: true,
    find: () => $(".guest[data-name='Natasha']")
                  .fadeOut(800, function () { $(this).remove(); }) },

  { title: "Who took the cake?",
    find: () => $(".floor[data-floor='1'] .guest.crumbs")
                  .not(".cup")
                  .filter(function () {
                    const t = $(this).attr("data-time");
                    return t > "21:00" && t < "21:30";
                  })
                  .filter(function () {
                    return $(this).prev().is(".aitu") || $(this).next().is(".aitu");
                  }) }
];

/* ---------- 1. SPOTLIGHT ---------- */
function spotlight($found) {
  // Исправлено: корректная подсветка для ВСЕХ найденных комнат
  const $bright = $found.hasClass("room") ? $found.find(".guest") : $found;
  $(".guest").not($bright).stop(true).fadeTo(300, 0.2);
}

function clearSpotlight() {
  $(".guest").stop(true, true).fadeTo(300, 1).removeClass("found");
  $(".room").removeClass("found");
  $("#result").text("");
}

function runCase(i) {
  closeCard(true);
  buildParty();
  const $found = cases[i].find();

  $found.addClass("found");
  if (!cases[i].noJump) {
    $found.animate({ top: -14 }, 150).animate({ top: 0 }, 150);
  }
  spotlight($found);

  const names = $found.map(function () {
    return $(this).is(".room") ? $(this).attr("data-room") : $(this).attr("data-name");
  }).get();

  $("#result").text("Case " + (i + 1) + ": " + cases[i].title +
    "  →  " + names.length + ": " + names.join(", "));
}

/* ---------- 2. КАРТОЧКА ГОСТЯ ---------- */
const CARD_W = 230;
const THING_ORDER = ["phone", "glasses", "bag", "cup", "crumbs"];
const THING_WORDS = { phone: "a phone", glasses: "glasses", bag: "a bag",
                      cup: "a cup", crumbs: "cake crumbs" };

let $card = null;

function joinWords(a) {
  return a.length < 2 ? a.join("") : a.slice(0, -1).join(", ") + " and " + a[a.length - 1];
}

function describeGuest($g) {
  const things = THING_ORDER.filter(t => $g.hasClass(t)).map(t => THING_WORDS[t]);
  return [
    "Came at " + $g.attr("data-time"),
    $g.hasClass("aitu") ? "AITU student" : "Not an AITU student",
    "Wears " + $g.attr("data-color") + " clothes",
    things.length ? "Has " + joinWords(things) : "Has nothing with them"
  ];
}

function openCard($guest) {
  closeCard();

  const name = $guest.attr("data-name");
  const room = $guest.closest(".room").attr("data-room");
  const $avatar = $guest.find(".avatar");
  const pos = $avatar.offset();
  const size = $avatar.outerWidth();

  const $head = $("<div>").addClass("card-head")
    .append($("<img>").attr("src", $avatar.attr("src")).css({ width: size, height: size }))
    .append($("<div>").addClass("card-title")
      .append($("<strong>").text(name))
      .append($("<span>").text("Room: " + room)));

  const $list = $("<ul>").addClass("card-list")
    .append(describeGuest($guest).map(t => $("<li>").text(t)));

  const $moves = $("<div>").addClass("card-moves");
  if (party.some(r => r.guests.some(g => g.name === name))) {
    party.filter(r => r.room !== room).forEach(function (r) {
      $("<button>").addClass("move-btn")
        .attr({ "data-guest": name, "data-room": r.room })
        .text("Move to the " + r.room.toLowerCase())
        .appendTo($moves);
    });
  }

  $card = $("<div>").addClass("guest-card")
    .data({ guest: name, size: size })
    .append($head, $list);
  if ($moves.children().length) $card.append($moves);

  $card.css({ width: CARD_W, height: "auto", left: 0, top: 0, visibility: "hidden" })
       .appendTo("body");
  const fullH = $card.outerHeight();

  let left = pos.left + size / 2 - CARD_W / 2;
  left = Math.max(10, Math.min(left, $(window).width() - CARD_W - 10));
  const top = Math.max(10, pos.top - 8);

  $card.css({ left: pos.left, top: pos.top, width: size, height: size,
              borderRadius: size / 2 + "px", visibility: "visible" });

  $card.animate({ left: left, top: top, width: CARD_W, height: fullH,
                  borderRadius: "14px" }, 250);
}

function closeCard(instant) {
  if (!$card) return;
  const $c = $card;
  $card = null;

  if (instant) { $c.stop(true).remove(); return; }

  const size = $c.data("size");
  const $avatar = $(".guest[data-name='" + $c.data("guest") + "'] .avatar");

  if (!$avatar.length) { $c.stop(true).fadeOut(150, function () { $(this).remove(); }); return; }

  const pos = $avatar.offset();
  $c.stop(true).animate({ left: pos.left, top: pos.top, width: size, height: size,
                          borderRadius: size / 2 + "px" }, 200,
    function () { $(this).remove(); });
}

/* ---------- 3. ПЕРЕЕЗД ГОСТЯ ---------- */
const MOVE_TIME = 700;
const GAP = 8;
const moves = [];

function finishMove(m) {
  if (m.done) return;
  m.done = true;
  moves.splice(moves.indexOf(m), 1);

  const $new = makeCard(m.g).css("opacity", m.opacity).toggleClass("found", m.found);
  m.$slot.replaceWith($new);
  m.$guest.remove();
  m.$clone.remove();
}

function finishMoves() {
  moves.slice().forEach(function (m) {
    m.$clone.stop(true);
    m.$guest.stop(true);
    m.$slot.stop(true);
    finishMove(m);
  });
}

function cancelMoves() {
  moves.splice(0).forEach(function (m) {
    m.done = true;
    m.$clone.stop(true).remove();
    m.$guest.stop(true);
    m.$slot.stop(true);
  });
}

function resetSortState($room) {
  $room.data("sorted", false).find(".sort-btn").removeClass("active");
}

function moveGuest(name, toRoom) {
  const from = party.find(r => r.guests.some(g => g.name === name));
  const to = party.find(r => r.room === toRoom);
  if (!from || !to || from === to) return;

  finishMoves();
  closeCard(true);

  const $guest = $(".guest[data-name='" + name + "']").not(".flying");
  if (!$guest.length) return;

  $guest.stop(true, true);
  if (!$.contains(document, $guest[0])) return;

  const g = from.guests.find(x => x.name === name);
  from.guests.splice(from.guests.indexOf(g), 1);
  to.guests.push(g);

  resetSortState($guest.closest(".room"));
  resetSortState($(".room[data-room='" + toRoom + "']"));

  const start = $guest.offset();
  const fullW = $guest.outerWidth();
  const fullH = $guest.outerHeight();

  const $clone = $guest.clone()
    .addClass("flying")
    .css({ position: "absolute", left: start.left, top: start.top, margin: 0, zIndex: 150 })
    .appendTo("body");

  const $slot = $("<div>").addClass("slot")
    .css({ width: 0, height: fullH, marginRight: -GAP })
    .appendTo(".room[data-room='" + toRoom + "'] .guests");

  $slot.css({ width: fullW, marginRight: 0 });
  const end = $slot.offset();
  $slot.css({ width: 0, marginRight: -GAP });

  $guest.css({ visibility: "hidden", overflow: "hidden", minWidth: 0 });

  const m = { g: g, $guest: $guest, $clone: $clone, $slot: $slot, done: false,
              opacity: $clone.css("opacity"), found: $clone.hasClass("found") };
  moves.push(m);

  $guest.animate({ width: 0, paddingLeft: 0, paddingRight: 0, marginRight: -GAP }, MOVE_TIME);
  $slot.animate({ width: fullW, marginRight: 0 }, MOVE_TIME);
  $clone.animate({ left: end.left, top: end.top }, MOVE_TIME, function () { finishMove(m); });
}

/* ---------- 4. СОРТИРОВКА ПО ВРЕМЕНИ ---------- */
const SORT_TIME = 600;

function sortRoom($room) {
  finishMoves();
  closeCard(true);

  const $guests = $room.find(".guests");
  const roomName = $room.attr("data-room");

  $guests.children(".guest").stop(true, true);
  const $cards = $guests.children(".guest");

  const cardList = $cards.toArray();
  const first = cardList.map(el => $(el).offset());

  const sorted = !$room.data("sorted");
  const ordered = cardList.slice();
  if (sorted) {
    ordered.sort((a, b) => $(a).attr("data-time").localeCompare($(b).attr("data-time")));
  } else {
    const names = party.find(r => r.room === roomName).guests.map(g => g.name);
    const idx = el => { const i = names.indexOf($(el).attr("data-name")); return i < 0 ? 999 : i; };
    ordered.sort((a, b) => idx(a) - idx(b));
  }
  $guests.append(ordered);
  $room.data("sorted", sorted).find(".sort-btn").toggleClass("active", sorted);

  cardList.forEach(function (el, i) {
    const last = $(el).offset();
    $(el).css({ left: first[i].left - last.left, top: first[i].top - last.top })
         .animate({ left: 0, top: 0 }, SORT_TIME);
  });
}

$(function () {
  buildParty();

  cases.forEach(function (c, i) {
    $("<button>").text((i + 1) + ". " + c.title)
      .on("click", () => runCase(i))
      .appendTo("#cases");
  });

  $("<button>").text("Clear").addClass("clear")
    .on("click", clearSpotlight)
    .appendTo("#cases");

  $(document).on("click", function (e) {
    const $t = $(e.target);

    const $btn = $t.closest(".move-btn");
    if ($btn.length) {
      moveGuest($btn.attr("data-guest"), $btn.attr("data-room"));
      return;
    }
    const $sort = $t.closest(".sort-btn");
    if ($sort.length) {
      sortRoom($sort.closest(".room"));
      return;
    }
    if ($t.closest(".guest-card").length) return;
    const $guest = $t.closest(".guest");
    if ($guest.length) openCard($guest);
    else closeCard();
  });

  $(document).on("keydown", function (e) {
    if (e.key === "Escape") closeCard();
  });
});