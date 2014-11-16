angular.module('gDPopup', ['gDraft.services', 'angular-c3'])

.controller('gDController', function($scope, $http, services, c3Factory){
  $scope.undrafted = [];
  $scope.suggestions = [];
  $scope.drafted = [];
  $scope.user = '';
  $scope.state = {};
  $scope.lineupSize = 12;
  $scope.normalizedTeamStats = {};

  $scope.leagueAverages = {
    "TO": 113.58,
    "BLK": 43.44,
    "ST": 62.16,
    "AST": 176.84,
    "REB": 332.6,
    "PTS": 1004.8,
    "3PTM": 54.16,
    "FT%": 0,
    "FTA": 269.2,
    "FTM": 219.8,
    "FG%": 0,
    "FGA": 768,
    "FGM": 365
  };

  // corrected to match yahoo
  $scope.teamStats = {
    "FGM": 0,
    "FGA": 0,
    "FG%": 0,
    "FTM": 0,
    "FTA": 0,
    "FT%": 0,
    "3PTM": 0,
    "PTS": 0,
    "REB": 0,
    "AST": 0,
    "ST": 0,
    "BLK": 0,
    "TO": 0,
  };

  $scope.playerStats = {
    "FGM": 0,
    "FGA": 0,
    "FG%": 0,
    "FTM": 0,
    "FTA": 0,
    "FT%": 0,
    "3PTM": 0,
    "PTS": 0,
    "REB": 0,
    "AST": 0,
    "ST": 0,
    "BLK": 0,
    "TO": 0,
  };

  $scope.config = {
    data: {
      columns: [
        [
          'teamStats',
          $scope.teamStats['FGM'],
          $scope.teamStats['FGA'],
          $scope.teamStats["FG%"],
          $scope.teamStats['FTM'],
          $scope.teamStats['FTA'],
          $scope.teamStats['FT%'],
          $scope.teamStats['3PTM'],
          $scope.teamStats['PTS'],
          $scope.teamStats['REB'],
          $scope.teamStats['AST'],
          $scope.teamStats['ST'],
          $scope.teamStats['BLK'],
          $scope.teamStats['TO'],
        ],
        [
          'playerStats',
          $scope.playerStats['FGM'],
          $scope.playerStats['FGA'],
          $scope.playerStats["FG%"],
          $scope.playerStats['FTM'],
          $scope.playerStats['FTA'],
          $scope.playerStats['FT%'],
          $scope.playerStats['3PTM'],
          $scope.playerStats['PTS'],
          $scope.playerStats['REB'],
          $scope.playerStats['AST'],
          $scope.playerStats['ST'],
          $scope.playerStats['BLK'],
          $scope.playerStats['TO'],
        ]
      ],
      type: 'bar',
      groups: [
        ['playerStats', 'teamStats']
      ]
    },
    axis: {
      x: {
        height:60,
        max: 11,
        type: 'category',
        tick:{
          rotate:90
        },
        categories: ['FGM', 'FGA',	'FG%', 'FTM',	'FTA', 'FT%', '3PTM',	'PTS',	'REB',	'AST',	'ST',	'BLK',	'TO']
      },
      y: {
        max: 120,
        label: "% of League Average"
      }
    },
    size: {
      height: '400',
      width: '275'
    }

  };



  // $http.get('http://giraffedraft.azurewebsites.net/api/init').
  // // success(function(data, status, headers, config){
  // //   $scope.undrafted = data;
  // //   $scope.calculate();

  // // }).
  // error(function(data, status, headers, config){
  //   console.log('failed!!!!!!!!!!!')
  // })

  services.loadPlayers()
  .then(function(data){
    console.log(data);
    $scope.undrafted = data;
    // $scope.calculate();
  });

  // $scope.calculate = function(){
  //   services.getSuggestions($scope.undrafted)
  //     .then(function(data){
  //       $scope.suggestions = data;
  //     })
  // }

  $scope.markDrafted = function(){
    $scope.drafted.push(this.player)
    var ind = $scope.undrafted.indexOf(this.player)
    $scope.undrafted.splice(ind,1);
    for(key in this.player) {
      if (key !== "NAME" && key !== "Player") {
        $scope.teamStats[key] += parseInt(this.player[key]);
      }
    }

    console.log($scope.teamStats);

    c3Factory.get('chart').then(function(chart) {
      chart.load({
        columns: [
          [
            'teamStats',
            $scope.normalizedTeamStats['FGM'],
            $scope.normalizedTeamStats['FGA'],
            $scope.normalizedTeamStats["FG%"],
            $scope.normalizedTeamStats['FTM'],
            $scope.normalizedTeamStats['FTA'],
            $scope.normalizedTeamStats['FT%'],
            $scope.normalizedTeamStats['3PTM'],
            $scope.normalizedTeamStats['PTS'],
            $scope.normalizedTeamStats['REB'],
            $scope.normalizedTeamStats['AST'],
            $scope.normalizedTeamStats['ST'],
            $scope.normalizedTeamStats['BLK'],
            $scope.normalizedTeamStats['TO'],
          ],
        ],
      });
    });

    // $scope.calculate();
  }

  $scope.addPlayerStats = function(){
    $scope.playerStats = this.player;
    console.log(this.player);
    c3Factory.get('chart').then(function(chart) {
      chart.load({
        columns: [
          [
            'playerStats',
            1,
            3,
            3,
            4,
            5,
            6,7,8,9,10,11,12,13
            // $scope.playerStats['FGM'],
            // $scope.playerStats['FGA'],
            // $scope.playerStats["FG%"],
            // $scope.playerStats['FTM'],
            // $scope.playerStats['FTA'],
            // $scope.playerStats['FT%'],
            // $scope.playerStats['3PTM'],
            // $scope.playerStats['PTS'],
            // $scope.playerStats['REB'],
            // $scope.playerStats['AST'],
            // $scope.playerStats['ST'],
            // $scope.playerStats['BLK'],
            // $scope.playerStats['TO'],
          ]
        ],
      });
    });
  }

  $scope.removePlayerStats = function(){
    $scope.playerStats = {};
    c3Factory.get('chart').then(function(chart) {
      chart.unload({
        ids:['playerStats']
      });
    });
  }

  // var svg = d3.select("body").append("svg")
  //   .attr("width", "1000")
  //   .attr("height", "1000")
  //   .attr("fill", "blue")
  //

  // update: will be called on each ng-click or ng-mouseover event.
  // should use the
  // $scope.update = function() {
  //   console.log('updating');
  //   var data = [];
  //   console.log(Object.keys($scope.teamStats));
  //   for (key in $scope.teamStats) {
  //     if (key !== '$$hashKey') {
  //       data.push($scope.teamStats[key]);
  //     }
  //   };
  //
  //   console.log(data);
  //
  //   var graph = svg.selectAll("rect")
  //     .data(data, function(d) {return d;})
  //   console.log(graph);
  //
  //   graph.enter().append("rect")
  //     .attr('width', function(d) { return d; })
  //     .attr('height', 10)
  //     .attr('fill','blue')
  //     .attr('y', function(d, i) { return i * 10; })
  // }

  $scope.updateState = function() {

  };

  $scope.normalize = function() {
    for (var category in $scope.teamStats) {
      $scope.normalizedTeamStats[category] = ($scope.teamStats[category] * 100) / ($scope.leagueAverages[category] * $scope.lineupSize);
    }
    $scope.normalizedTeamStats['FT%'] = $scope.teamStats['FTM'] * 100 / $scope.teamStats['FTA'];
    $scope.normalizedTeamStats['FG%'] = $scope.teamStats['FGM'] * 100 / $scope.teamStats['FGA'];
  };

  // refactor this to a service

  // service has a callback list
  // and this.onMessage function to store a callback
  window.addEventListener("message", receiveMessage, false);

  function receiveMessage(event) {
    console.log("=======================message received in slider.js!======================");
    console.log(event.data);

    if (event.data.user) {
      $scope.user = event.data.user;
    }

    if (event.data.state) {
      if (!$scope.user) {
        console.log("error: user not set");
      }
      else {
        // reset scope and teamStats
        $scope.state = event.data.state;
        $scope.teamStats = {
          "FGM": 0,
          "FGA": 0,
          "FG%": 0,
          "FTM": 0,
          "FTA": 0,
          "FT%": 0,
          "3PTM": 0,
          "PTS": 0,
          "REB": 0,
          "AST": 0,
          "ST": 0,
          "BLK": 0,
          "TO": 0
        };

        var state = $scope.state;
        var user = $scope.user;
        console.log(user);
        console.log(state[user]);
        for (var key in state[user]) {
          var player = state[user][key];
          console.log(player);
          for (var stat in player) {
            var data = player[stat];
            $scope.teamStats[stat] += parseFloat(data);
          }
        }
        console.log($scope.teamStats);
      }

      // update angular bindings
      $scope.$apply();

      $scope.normalize();

      c3Factory.get('chart').then(function(chart) {
        chart.load({
          columns: [
            [
              'teamStats',
              $scope.normalizedTeamStats['FGM'],
              $scope.normalizedTeamStats['FGA'],
              $scope.normalizedTeamStats["FG%"],
              $scope.normalizedTeamStats['FTM'],
              $scope.normalizedTeamStats['FTA'],
              $scope.normalizedTeamStats['FT%'],
              $scope.normalizedTeamStats['3PTM'],
              $scope.normalizedTeamStats['PTS'],
              $scope.normalizedTeamStats['REB'],
              $scope.normalizedTeamStats['AST'],
              $scope.normalizedTeamStats['ST'],
              $scope.normalizedTeamStats['BLK'],
              $scope.normalizedTeamStats['TO'],
            ],
          ],
        });
      });
    }
  }
});
