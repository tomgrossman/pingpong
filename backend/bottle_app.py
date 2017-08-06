import bottle
import match_manager


match_manager = match_manager.MatchManager()


@bottle.route('/accept_link/<match_id>')
def accept_match(match_id):
    match_manager.accept_match_invitation(
        match_id=match_id,
    )


bottle.run(host='localhost', port=8080, debug=True)
