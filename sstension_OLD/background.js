let sstension = (function() {
    let configs;
    let listeners;

    // configs
    configs = {
        codes: {
            confluence: 'cf',
            datadog: 'dd',
            github: 'gh',
            googleDrive: 'gd',
            jira: 'jira',
            serviceDesk: 'sd'
        },
        githubBaseURL: 'https://github.com/search?q=org%3AGroupe-Atallah+',
        confluenceBaseURL: 'https://ssense.atlassian.net/wiki/search?text=',
        googleDriveBaseURL: 'https://drive.google.com/drive/u/1/search?q=',
        jiraBaseURL: 'https://ssense.atlassian.net/secure/QuickSearch.jspa?searchString=',
        jira: {
            searchUrl: 'https://ssense.atlassian.net/secure/QuickSearch.jspa?searchString=',
            projectUrl: 'https://ssense.atlassian.net/browse/',
            projects: [
                'ADA', 'ARCH', 'ASMR', 'AUTO', 'AUTOII', 'AUTOIII', 'BAT', 'CA', 'CDPT', 'CHIN', 'CMS', 'CO', 'CPTD', 'CR', 'CS', 'CXBA', 'CXP', 'DE', 'DEVOPS', 'DK', 'DO', 'DS', 'DSMDOPS', 'EC', 'EUDC',
                'FN', 'FOPS', 'FRD', 'FUJI', 'HG', 'HJ', 'HPT1', 'HTL', 'II', 'IMS', 'INTEL', 'IR', 'ITOPS', 'KATANA', 'KC', 'KOBE', 'MBF', 'MEET', 'MNA', 'MT', 'MXP', 'NC', 'NCAT', 'NGDC', 'OLY',
                'OMNI', 'OMS', 'ONL', 'PAY', 'PCIE', 'PET', 'PIM', 'PO', 'PRIV', 'PSS', 'QA', 'QEP', 'RA', 'REC', 'RES', 'RET', 'RIO', 'SALE', 'SALESPREP', 'SHA', 'SI', 'SPG', 'SRE', 'SRX', 'SS',
                'ST', 'STR', 'SU', 'TAG', 'TAXDUT', 'TB', 'WEBA', 'WHO', 'WMS', 'XBOW', 'XEN'
            ],
        },
        datadog: {
            home: 'https://app.datadoghq.com/apm/home?env=prod',
            logsURL: 'https://app.datadoghq.com/logs?query=',
            dashboardsURL:  'https://app.datadoghq.com/dashboard/lists?q=',
            monitorsURL: 'https://app.datadoghq.com/monitors/manage?q=',
            subcommands: {
                logs: 'logs',
                monitors: 'mon',
                dashboards: 'db',
            },
            status: ['info', 'error', 'warn'],
            env: ['prod', 'qa'],
            services: [
                'ui-website', 'ms-product', 'ag-shipping', 'ag-apssense', 'ms-shipping', 'ms-cart', 'ag-cart', 'dm-customer', 'ms-stockapi', 'ag-constellation', 'ms-reference', 'ms-pubsub', 'ag-recommendation',
                'ms-session', 'ms-studio', 'wk-pubsub-streaming-consumer', 'wk-pubsub-publishing-consumer', 'ms-duty', 'ml-gendercategory', 'hq-central', 'ag-checkout', 'ms-slg', 'ms-productrec', 'gw-models',
                'ssense-api', 'ms-tax', 'wk-product-index', 'ms-wishlist', 'ml-brandgender', 'dm-payment', 'dm-pim', 'ui-microsite', 'ms-hscode', 'wk-product-ordering', 'ms-color-bandit', 'dm-auth', 'ms-wmsoutput',
                'ag-datapipeline', 'wk-tariffclassification', 'wk-financeconsumer', 'ms-stockconsumerinventory', 'ag-journey', 'dm-customerorder-dom', 'ui-auth', 'ms-pricing', 'ag-account', 'ui-people', 'ap-ssense', 'ms-wishlistnotifications', 'ms-audit'
            ]
        },
        serviceDesk: {
            home: 'https://servicedesk.ssense.com/support/home',
            openUrl: 'https://servicedesk.ssense.com/support/catalog/items',
            ticketsUrl:  'https://servicedesk.ssense.com/support/tickets',
            subcommands: {
                open: 'open',
                tickets: 'tickets',
            }
        }
    };

    // helpers
    util = {
        buildDriveUrl: (terms) => {
            return configs.googleDriveBaseURL + terms.join(' ');
        },
        buildGithubUrl: (terms) => {
            return configs.githubBaseURL + terms.join(' ');
        },
        buildConfluenceUrl: (terms) => {
            return configs.confluenceBaseURL + terms.join(' ');
        },
        buildJiraUrl: (terms) => {
            let res = configs.jira.searchUrl + terms.join('%20');

            if(configs.jira.projects.includes(terms[0].toUpperCase()) ){
                const numbers = terms.filter(t => !isNaN(t));
                res = configs.jira.projectUrl + terms[0];
                if(numbers.length >  0){
                    res += `-${numbers[0]}`
                }
            }
            return res;
        },
        buildDatadogUrl: function(terms) {
            let res = configs.datadog.home;
            let query = '';
            if(terms.length === 2){
                query = terms[1];
            }

            if(terms[0] === configs.datadog.subcommands.logs){
                let env = terms.filter(t => configs.datadog.env.includes(t));
                if(env.length > 0){
                    query += `env%3A${env[0]}%20`;
                }

                let services = terms.filter(t => configs.datadog.services.includes(t));
                if(services.length > 0){
                    query += `service%3A${services[0]}%20`
                }

                let status = terms.filter(t => configs.datadog.status.includes(t));
                if(status.length > 0){
                    query += `status%3A${status[0]}`;
                }

                res = configs.datadog.logsURL + query;
            }
            if(terms[0] === configs.datadog.subcommands.dashboards){
                res = configs.datadog.dashboardsURL + query;
            }
            if(terms[0] === configs.datadog.subcommands.monitors){
                res = configs.datadog.monitorsURL + query;
            }
            return res;
        },
        buildServiceDeskUrl: function(terms) {
            let res = configs.serviceDesk.home;
            if(terms.length === 0){
                console.log('hola')
                return res;
            }
            if(terms[0] === configs.serviceDesk.subcommands.tickets){
                res = configs.serviceDesk.ticketsUrl;
            }
            if(terms[0] === configs.serviceDesk.subcommands.open){
                res = configs.serviceDesk.openUrl;
            }
            return res;
        },
    }

    // listeners
    listeners = {
        // WIP
        onInputChanged: function(text, suggest) {
            let results = [];
            const terms = text.split(' ');
            const lastSubcommand = terms[-1];
            const re = new RegExp("^"+lastSubcommand);

            if(text === '' || terms === 1){
                for (const [key, value] of Object.entries(configs.codes)) {
                    if(value.match(re)) {
                        results.push({
                            content: value,
                            description: key
                        });
                    }
                }
            }
            // chrome.omnibox.setDefaultSuggestion({description: 'Hello'});
            suggest(results);
        },
        onInputEntered: function(text) {
            let url;
            const terms = text.split(' ');
            console.log('input: ' + text);
            if(terms.length > 0){
                const code = terms[0];
                //remove first element from array, only subcommands left
                terms.shift();

                switch (code){
                    case configs.codes.github:
                        url = util.buildGithubUrl(terms);
                        break;
                    case configs.codes.googleDrive:
                        url = util.buildDriveUrl(terms);
                        break;
                    case configs.codes.confluence:
                        url = util.buildConfluenceUrl(terms);
                        break;
                    case configs.codes.jira:
                        url = util.buildJiraUrl(terms);
                        break;
                    case configs.codes.datadog:
                        url = util.buildDatadogUrl(terms);
                        break;
                    case configs.codes.serviceDesk:
                        url = util.buildServiceDeskUrl(terms);
                        break;
                    default:
                        return;
                }

                if(url){
                    chrome.tabs.update({url: url});
                }
            }
        }
    };

    return {
        init: function() {
            // suggestions currently not working because theres a known bug in chrome
            // suggestions from background scripts only work with manifest v2
            // however, manifest v3 is mandatory as of jan 2022, even though
            // this bug prevents suggestion from appear
            // see https://bugs.chromium.org/p/chromium/issues/detail?id=1186804
            // chrome.omnibox.onInputChanged.addListener(listeners.onInputChanged);

            chrome.omnibox.onInputEntered.addListener(listeners.onInputEntered);
        }
    };
})();
sstension.init();
