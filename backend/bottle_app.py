import bottle
import match_manager
import tournament_manager
import threading

match_manager = match_manager.MatchManager()
tournament_manager = tournament_manager.TournamentManager()

@bottle.route('/accept_link/<match_id>')
def accept_match(
    match_id,
):
    return match_manager.accept_match_invitation(
        match_id=match_id,
    )



@bottle.route('/sign_up_for_tournament/<tournament_id>/player/<player_id>')
def sign_up_for_tournament(
    tournament_id,
    player_id,
):
    return tournament_manager.sign_up_player_for_tournament(
        tournament_id=tournament_id,
        player_id=player_id,
    )



thread = threading.Thread(
    target=bottle.run,
    kwargs={
        'host': '0.0.0.0',
        'port': 8080,
        'debug': True,
    }
)

def init():
    thread.start()
    match_manager.get_new_matches_and_send_invite()


init()
