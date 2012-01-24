
NANO.plugin(function (NANO) {

    var Sort = NANO.Sort = {};
    var searchResults = NANO.searchResults;

    // Алгоритм сортировки
    var Algorithm = function (a, b) {
        return b.price < a.price ? 1 : -1;
    };

    // Задать новый алгоритм

    Sort.set_sort = function (a) {
        Algorithm = a;
    };

});
