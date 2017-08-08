import bottle
import match_manager
import time
import tournament_manager
import threading
import schedule

match_manager = match_manager.MatchManager()
tournament_manager = tournament_manager.TournamentManager()

@bottle.route('/accept_match_score/<match_id>')
def accept_match_invite(
    match_id,
):
    return match_manager.accept_match_score(
        match_id=match_id,
    )



@bottle.route('/accept_match_invite/<match_id>')
def accept_match_invite(
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
            'server': 'tornado'
        }

    )
    bottle_thread.start()
    schedule.every(1).minutes.do(match_manager.get_new_matches_and_send_invite)
    schedule.every(5).minutes.do(match_manager.get_approval_for_match_result)
    # schedule.every(1).day.do(tournament_manager.finalize_tournament_registrations)
    # schedule.every(4).weeks.do(tournament_manager.create_tournament, tournament_type='monthly')
    # schedule.every(1).minutes.do(tournament_manager.create_next_stage_and_send_invites)
    #
    while True:
        schedule.run_pending()
init()
