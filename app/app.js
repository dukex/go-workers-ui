const stats = (state = {}, action) => {
  console.log(action);
  switch (action.type) {
    case "UPDATE_DATA":
      let jobs = [];
      const data = action.data;
      for(var queueTitle in action.data.jobs) {
        data.jobs[queueTitle].forEach(function (job) {
          job.message.enqueued_at =  moment(new Date(job.message.enqueued_at * 1000)).fromNow();
          job.started_at =  moment(new Date(job.started_at * 1000)).fromNow();
          jobs.push(job);
        });
      }
      return Object.assign({}, action.data, { jobs: jobs });
    default:
      return state;
  }
};

const { createStore } = Redux;
const store = createStore(stats);

const render = () => {
  const state = store.getState();
  const source = document.querySelector("#jobs-table-body-template").innerHTML;
  const compiled = Handlebars.compile(source)(state);
  document.querySelector("#processed .value").innerHTML = state.processed;
  document.querySelector("#failed .value").innerHTML = state.failed;
  document.querySelector("#jobs tbody").innerHTML = compiled;
};

store.subscribe(render);
render();

const  updateStats = () => {
  var request = new XMLHttpRequest();
  request.onreadystatechange = () => {
    if (request.readyState === 4) {
      if (request.status === 200) {
        var data = JSON.parse(request.responseText);
        store.dispatch({
          type: "UPDATE_DATA",
          data
        })
      } else {
        console.warn('There was a problem with the request.');
        console.log(request)
      }
    }
  };
  request.open('GET', "http://uhura-workers.herokuapp.com/stats");
  request.send();
}

const loop = () => {
  updateStats();
  window.setTimeout(loop, 2000);
}

loop();
