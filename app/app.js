class GoWorkersUI {
  constructor(workerURL) {
    this.rootURL = workerURL;
    this.loop();
  }

  loop() {
    this.stats();
    window.setTimeout(() => {
      this.loop();
    }, 2000)
  }

  update(data) {
    document.querySelector("#processed .value").innerHTML = data.processed;
    document.querySelector("#failed .value").innerHTML = data.failed;
    var jobs = this.__jobs(data);
    document.querySelector("#jobs tbody").innerHTML = this.__templateJob({jobs: jobs});
  }

  __templateJob(data) {
    var source   = document.querySelector("#jobs-table-body-template").innerHTML;
    return Handlebars.compile(source)(data);
  }

  __jobs(data) {
    var jobs = [];
    for(var queueTitle in data.jobs) {
      data.jobs[queueTitle].forEach(function (job) {
        job.message.enqueued_at =  moment(new Date(job.message.enqueued_at * 1000)).fromNow();
        job.started_at =  moment(new Date(job.started_at * 1000)).fromNow();
        jobs.push(job);
      });
    }
    return jobs;
  }

  stats() {
    var request = new XMLHttpRequest();
    request.onreadystatechange = () => {
      if (request.readyState === 4) {
        if (request.status === 200) {
          var data = JSON.parse(request.responseText);
          this.update(data);
        } else {
          window.alert('There was a problem with the request.');
        }
      }
    };
    request.open('GET', this.rootURL + "/stats");
    request.send();
  }
}
