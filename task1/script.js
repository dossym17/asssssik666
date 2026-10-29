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
    { name: "Zarina",  color: "green",  time: "22:30", aitu: false, things: ["bag", "phone", "crumbs"] }, // Исправлено время Зарины на 22:30
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
  const $house = $("#house").empty();

  [2, 1].forEach(function (floorNum) {
    const $floor = $("<div>").addClass("floor").attr("data-floor", floorNum);
    $floor.append($("<div>").addClass("floor-label").text("FLOOR " + floorNum));

    const $rooms = $("<div>").addClass("rooms");
    party.filter(r => r.floor === floorNum).forEach(function (r) {
      const $room = $("<div>").addClass("room").attr("data-room", r.room);
      $room.append($("<h2>").text(r.room));

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

  // Case 7: Включение граничных значений 20:30 и 21:00 включительно
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

  // Case 16: Безопасный переход без вложенных псевдоселекторов :has()
  { title: "Which rooms have a cup but no glasses?",
    find: () => $(".room").has(".guest.cup").not($(".room").has(".guest.glasses")) },

  // Case 17: Гарантированный возврат корректной выборки DOM-элементов
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

  // Case 20: Исправленная проверка точных соседей через .is(".aitu")
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

function runCase(i) {
  buildParty();
  const $found = cases[i].find();

  $found.addClass("found");
  if (!cases[i].noJump) {
    $found.animate({ top: -14 }, 150).animate({ top: 0 }, 150);
  }

  const names = $found.map(function () {
    return $(this).is(".room") ? $(this).attr("data-room") : $(this).attr("data-name");
  }).get();

  $("#result").text("Case " + (i + 1) + ": " + cases[i].title +
    "  →  " + names.length + ": " + names.join(", "));
}

$(function () {
  buildParty();

  cases.forEach(function (c, i) {
    $("<button>").text((i + 1) + ". " + c.title)
      .on("click", () => runCase(i))
      .appendTo("#cases");
  });
});