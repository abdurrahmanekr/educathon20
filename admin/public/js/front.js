$(function () {


    // ------------------------------------------------------- //
    // Sidebar
    // ------------------------------------------------------ //
    $('.sidebar-toggler').on('click', function () {
        $('.sidebar').toggleClass('shrink show');
    });



    // ------------------------------------------------------ //
    // For demo purposes, can be deleted
    // ------------------------------------------------------ //

    var stylesheet = $('link#theme-stylesheet');
    $( "<link id='new-stylesheet' rel='stylesheet'>" ).insertAfter(stylesheet);
    var alternateColour = $('link#new-stylesheet');

    if ($.cookie("theme_csspath")) {
        alternateColour.attr("href", $.cookie("theme_csspath"));
    }

    $("#colour").change(function () {

        if ($(this).val() !== '') {

            var theme_csspath = 'css/style.' + $(this).val() + '.css';

            alternateColour.attr("href", theme_csspath);

            $.cookie("theme_csspath", theme_csspath, { expires: 365, path: document.URL.substr(0, document.URL.lastIndexOf('/')) });

        }

        return false;
    });

    const statics = {
        Q1: {
            time: 10,
            hard: 0,
        },
        Q2: {
            time: 10,
            hard: 1,
        },
        Q3: {
            time: 10,
            hard: 2,
        },
    };

    const userAnalytics = function(user, statements) {
        const listDiv = document.getElementById('user-analytics');
        if (!listDiv)
            return;

        statements = statements
        .filter(function(x) { return x.actor.name === user })
        .sort(function(a, b) {
            return new Date(a.timestamp) - new Date(b.timestamp);
        });

        if (statements.length < 1)
            return;

        const totalTime = (new Date(statements[statements.length - 1].timestamp) - new Date(statements[0].timestamp)) / 1000;

        var indexVideo = statements.findIndex(function(x) { return x.object.id.indexOf('watched') !== -1 || x.object.id.indexOf('passed') !== -1 });
        var videoTime = 0;

        if (indexVideo !== -1) {
            videoTime = (new Date(statements[indexVideo].timestamp) - new Date(statements[indexVideo-1].timestamp)) / 1000;
        }

        const Q1Index = statements.findIndex(function(x) { return x.object.id.indexOf('question_1') !== -1 });
        const Q2Index = statements.findIndex(function(x) { return x.object.id.indexOf('question_2') !== -1 });
        const Q3Index = statements.findIndex(function(x) { return x.object.id.indexOf('question_3') !== -1 });

        const Q1Time = (new Date(statements[Q1Index+1].timestamp) - new Date(statements[Q1Index].timestamp)) / 1000;
        const Q2Time = (new Date(statements[Q2Index+1].timestamp) - new Date(statements[Q2Index].timestamp)) / 1000;
        const Q3Time = (new Date(statements[Q3Index+1].timestamp) - new Date(statements[Q3Index].timestamp)) / 1000;

        $("#user-analytics #totalTime").text(totalTime + ' saniye');
        $("#user-analytics #videoTime").text(videoTime);
        $("#user-analytics #hard0").text(statements[Q1Index].object.id.indexOf('true') !== -1 ? 1 : 0);
        $("#user-analytics #hard1").text(statements[Q2Index].object.id.indexOf('true') !== -1 ? 1 : 0);
        $("#user-analytics #hard2").text(statements[Q3Index].object.id.indexOf('true') !== -1 ? 1 : 0);

        $("#user-analytics #Q1Time").text(Q1Time);
        $("#user-analytics #Q2Time").text(Q2Time);
        $("#user-analytics #Q3Time").text(Q3Time);

        $("#user-analytics #Q1Status").text(Q1Time > statics.Q1.time ? 'Öğrenciniz bu soruyu anlamamış' : 'Bu kadar kolay sormamalısınız');
        $("#user-analytics #Q2Status").text(Q2Time > statics.Q2.time ? 'Öğrenciniz bu soruyu anlamamış' : 'Bu kadar kolay sormamalısınız');
        $("#user-analytics #Q3Status").text(Q3Time > statics.Q3.time ? 'Öğrenciniz bu soruyu anlamamış' : 'Bu kadar kolay sormamalısınız');


        $("#user-analytics #users").empty();
    };

    const generalAnalytics = function(statements) {
        const username = new URLSearchParams(window.location.search).get('username');

        if (username)
            userAnalytics(username, statements);

        const listDiv = document.getElementById('general-analytics');

        if (!listDiv)
            return;

        const users = Array.from(new Set(statements.map(function(x) { return x.actor.name; })));

        const correctQ1 = statements.filter(function(x) { return x.object.id.indexOf('question_1_true') !== -1 }).length;
        const correctQ2 = statements.filter(function(x) { return x.object.id.indexOf('question_2_true') !== -1 }).length;
        const correctQ3 = statements.filter(function(x) { return x.object.id.indexOf('question_3_true') !== -1 }).length;

        console.log(correctQ1, correctQ2, correctQ3);

        $("#general-analytics #totalCount").text(users.length);
        $("#general-analytics #Q1Count").text(correctQ1);
        $("#general-analytics #Q2Count").text(correctQ2);
        $("#general-analytics #Q3Count").text(correctQ3);


        $("#general-analytics #users").empty();

        users.forEach(function(x) {
            $("#general-analytics #users").append(`<li><a href="/admin/analytics/?username=${encodeURIComponent(x)}">${x}</a></li>`)
        });
    };

    const conf = {
        endpoint: 'https://sample-lrs-paiseze.lrs.io/xapi/',
        auth: 'Basic ' + toBase64('username:password'),
    };

    ADL.XAPIWrapper.changeConfig(conf);

    window.fetchStataments = function () {
        const parameters = ADL.XAPIWrapper.searchParams();

        parameters['agent'] = '{"mbox": "mailto:educathon20@educathon20.herokuapp.com"}';

        const queryData = ADL.XAPIWrapper.getStatements(parameters);

        if (queryData.statements && queryData.statements.length > 0) {
            let list = [];

            generalAnalytics(queryData.statements.filter(function(x) { return x.actor && x.actor.name }));

            queryData.statements.forEach(function(x, i) {
                const desc = x.object.definition.description ? x.object.definition.description['en-US'] : (x.object.definition.name ? x.object.definition.name['en-US'] : x.object.id);

                list.push(`
                    <div class="d-flex justify-content-between align-items-start align-items-sm-center mb-4 flex-column flex-sm-row">
                      <div class="left d-flex align-items-center">
                        <div class="text">
                          <h6 class="mb-0 d-flex align-items-center"> <span>${x.actor && x.actor.name || 'Bilinmeyen Birisi'}</span><span class="dot dot-sm ml-2 mr-2 bg-violet"></span> ${desc}</h6><small class="text-gray">${new Date(x.timestamp).toLocaleString()}</small>
                        </div>
                      </div>
                      <div class="right ml-5 ml-sm-0 pl-3 pl-sm-0 text-violet">
                        <h5>${x.verb.display['en-US']}</h5>
                      </div>
                    </div>
                `.trim());
            });

            let eventList = document.getElementById('event-list');

            if (eventList) {
                eventList.innerHTML = list.join('\n');
            }
        }

        setTimeout(window.fetchStataments, 1000);
    };

    fetchStataments();

});


Cookies.set('active', 'true');
