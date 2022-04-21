var issueContainerEl = document.querySelector("#issues-container");
var limitWarningEl = document.querySelector("#limit-warning");
var repoNameEl = document.querySelector("#repo-name");

var getRepoName = function () {
    // find the query parameters of repo URL passed from index.html
    var queryString = document.location.search;

    // parse queryString to get repo name passed from index.html
    var repoName = queryString.split("=")[1];
    if (repoName) {
        // display name of repo and run function to retrieve and display issues/pull request
        repoNameEl.textContent = repoName;

        getRepoIssues(repoName);
    }
    else {
        // if no repo was given, redirect to homepage
        document.location.replace("./index.html");
    }
};


var getRepoIssues = function (repo) {
    var apiUrl = "https://api.github.com/repos/" + repo + "/issues?direction=asc";
    fetch(apiUrl).then(function (response) {
        // request was successful
        if (response.ok) {
            response.json().then(function (data) {
                // pass response data to dom function
                displayIssues(data);

                // check if api has paginated issues
                if (response.headers.get("Link")) {
                    displayWarning(repo);
                }
            });
        }
        else {
            // if not succcessful, redirect to homepage
            document.location.replace("./index.html");
        }
    });
};

// display issues as html elements on the page
var displayIssues = function (issues) {
    // display if no issues in repo
    if (issues.length === 0) {
        issueContainerEl.textContent = "This repo has no open issues!";
        return;
    }

    for (var i = 0; i < issues.length; i++) {
        // create a link element to take users to the issue on github
        var issueEl = document.createElement("a");
        issueEl.classList = "list-item flex-row justify-space-between align-center";
        issueEl.setAttribute("href", issues[i].html_url);
        issueEl.setAttribute("target", "_blank");

        // create span to hold issue title
        var titleEl = document.createElement("span");
        titleEl.textContent = issues[i].title;
        // append to container element
        issueEl.appendChild(titleEl);

        // create a type element
        var typeEl = document.createElement("span");

        // check if issue is an actual issue or pull request
        if (issues[i].pull_request) {
            typeEl.textContent = "(Pull request)";
        } else {
            typeEl.textContent = "(Issue)";
        }

        // append to container
        issueEl.appendChild(typeEl);

        // append issues and pull request to the container element to display
        issueContainerEl.appendChild(issueEl);
    }
};

var displayWarning = function (repo) {
    // add text to warning container
    limitWarningEl.textContent = "To see more than 30 issues, visit ";

    var linkEl = document.createElement("a");
    linkEl.textContent = "See More Issues on GitHub.com";
    linkEl.setAttribute("href", "https://github.com/" + repo + "/issues");
    linkEl.setAttribute("target", "_blank");

    // append to warning container
    limitWarningEl.appendChild(linkEl);
};


getRepoName();