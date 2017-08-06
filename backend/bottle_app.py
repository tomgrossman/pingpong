import bottle
import match_manager
import tournament_manager
import threading
import schedule

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

    try:
        return tournament_manager.sign_up_player_for_tournament(
            tournament_id=tournament_id,
            player_id=player_id,
        )
    except ValueError:
        return '''Tournament is closed for registration.'''




def init():
    bottle_thread = threading.Thread(
        target=bottle.run,
        kwargs={
            'host': '0.0.0.0',
            'port': 8080,
            'debug': True,
            }
        )
    bottle_thread.start()
    schedule.every(1).minute.do(match_manager.get_new_matches_and_send_invite)
    schedule.every(1).day.do(tournament_manager.finalize_tournament_registrations)
    schedule.every(1).month.do(tournament_manager.create_tournament, tournament_type='monthly')
    schedule.every(3).month.do(tournament_manager.create_tournament, tournament_type='quarterly')

init()