"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var GoWorkersUI = (function () {
  function GoWorkersUI(workerURL) {
    _classCallCheck(this, GoWorkersUI);

    this.rootURL = workerURL;
    this.loop();
  }

  _createClass(GoWorkersUI, [{
    key: "loop",
    value: function loop() {
      var _this = this;

      this.stats();
      window.setTimeout(function () {
        _this.loop();
      }, 2000);
    }
  }, {
    key: "update",
    value: function update(data) {
      document.querySelector("#processed .value").innerHTML = data.processed;
      document.querySelector("#failed .value").innerHTML = data.failed;
      var jobs = this.__jobs(data);
      document.querySelector("#jobs tbody").innerHTML = this.__templateJob({ jobs: jobs });
    }
  }, {
    key: "__templateJob",
    value: function __templateJob(data) {
      var source = document.querySelector("#jobs-table-body-template").innerHTML;
      return Handlebars.compile(source)(data);
    }
  }, {
    key: "__jobs",
    value: function __jobs(data) {
      var jobs = [];
      for (var queueTitle in data.jobs) {
        data.jobs[queueTitle].forEach(function (job) {
          job.message.enqueued_at = moment(new Date(job.message.enqueued_at * 1000)).fromNow();
          job.started_at = moment(new Date(job.started_at * 1000)).fromNow();
          jobs.push(job);
        });
      }
      return jobs;
    }
  }, {
    key: "stats",
    value: function stats() {
      var _this2 = this;

      var request = new XMLHttpRequest();
      request.onreadystatechange = function () {
        if (request.readyState === 4) {
          if (request.status === 200) {
            var data = JSON.parse(request.responseText);
            _this2.update(data);
          } else {
            console.warn("There was a problem with the request.");
            console.log(request);
          }
        }
      };
      request.open("GET", this.rootURL + "/stats");
      request.send();
    }
  }]);

  return GoWorkersUI;
})();