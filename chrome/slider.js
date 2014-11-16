angular.module('gDPopup', ['gDraft.services', 'angular-c3'])

.controller('gDController', function($scope, $http, services, c3Factory){
  $scope.undrafted = [];
  $scope.suggestions = [];
  $scope.drafted = [];
  $scope.user = '';
  $scope.state = {};

  $scope.leagueAverages = {
    // "TO":
    // "BLK":
    // "ST":
    // "AST":
    // "REB":
    // "PTS":
    // "3PTM"
    // "FT%":
    // "FTA":
    // "FTM":
    // "FG%":
    // "FGA":
    // "FGM":

    "MIN":48*82,
    "3PM":7.5*82,
    "FGM":0.5,
    "BLK":4.8*82,
    "STL":7.2*82,
    "AST":21.2*82,
    "GP":82,
    "REB":42.1*82,
    "FT%":0.5,
    "PTS":99.4*82,
    "TO":14.9*82
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
        max: 3000
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
        ],
      });
    });

    // $scope.calculate();
  }

  $scope.addPlayerStats = function(){
    $scope.playerStats = this.player
    console.log(this.player)
    c3Factory.get('chart').then(function(chart) {
      chart.load({
        columns: [
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

      c3Factory.get('chart').then(function(chart) {
        chart.load({
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
          ],
        });
      });
    }
  }
});
