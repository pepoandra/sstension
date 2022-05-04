Quickly access several SSENSE resources for employees from your address bar.

Usage:  ss [command] [subcommand] [arguments]
The arguments can be in any order.

Examples:
ss gh [query]
ss gh TermToSearch -> searches TermToSearch on SSENSE Github organization

ss gh [query]
ss cf TermToSearch -> searches TermToSearch on SSENSE Confluence

ss jira [project name] [ticket number] [bl]
ss jira tag -> Opens TAG team's project on Jira
ss jira devops bl -> Opents Devops' team backlog
ss jira rec 3440  -> Opens ticket REC-3440 on Jira

ss dd [mon|db|logs] [prod|qa] [info|error|warn]  [service name]
ss dd mon ms-pro -> Opens the Monitor page on DataDog and searches for ms-pro
ss dd db ag-reco -> Opens the Dashboards page on DataDog and searches for ag-reco
ss dd logs prod ms-product error -> Opens the error logs in prod for the service ms-product
