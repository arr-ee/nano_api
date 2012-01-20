
NANO.plugin(function (sandbox) {

    var Sort = sandbox.Sort = {};
    var SearchResults = sandbox.SearchResults;


    // Алгоритм сортировки

    var Algorithm = function (a, b) {

        return b.price < a.price ? 1 : -1;
    };


    // Задать новый алгоритм

    Sort.set_sort = function (a) {

        Algorithm = a;
    };

});
