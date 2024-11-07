import main as main

hist_csv_name = "historic.csv"
teams_csv_name = 'teams.csv'


all_data = main.CurrentResults(teams_csv_name, hist_csv_name, "20242025")


main.macguffin(all_data,"data/macguffin.csv")
main.ReverseMacguffin(all_data,"data/reverse-macguffin.csv")
main.all_conf(all_data, teams_csv_name,"data/ConfMcguffins.csv")

main.leaderboards("data/macguffin.csv","forward")
main.leaderboards("data/reverse-macguffin.csv","reverse")
