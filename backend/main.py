import pymongo

# not needed but lets keep the code for now
# def insert_new_player_to_DB(
#     _id,
#     email,
#     full_name,
#     team,
#     points,
# ):
#     try:
# 		db.Players.insert_one(
# 			{
#                 '_id': _id,
#                 'email': email,
#                 'full_name': full_name,
#                 'team': team,
#                 'points': 0,
# 			}
#         )

#     except Exception, e:
#         print str(e)


def get_all_players():
    try:
		platyersColletion = db.Players.find()
		# for player in platyersColletion:
		# 	print player
        return platyersColletion

    except Exception, e:
        print str(e)


def update_player_info(
    _id,
    email,
    full_name,
    team,
    points,
):
    try:
        db.Players.update_one(
			{"_id": _id},
			{
			    "$set": {
                        'email': email,
                        'full_name': full_name,
                        'team': team,
                        'points': points,
			    }
			}
		)
    except Exception, e:
		print str(e)


def delete(
    _id,
):
    try:
       db.Players.delete_many({"_id":_id})

    except Exception, e:
		print str(e)


# where shit happens
def main():
    # mongodb://10.0.0.232/ping_pong
    client = MongoClient('10.0.0.232/ping_pong')
    db = client.PingPongData
    get_all_players()



#### some examples for now, delete later ####

# users:
#     _id (ObjectId)
#     email (string)
#     full_name (string)
#     team (r&d, analysts, product, hr)
#     points (number)

# user = {
#     '_id'= '',
#     'email'= '',
#     'full_name'= '',
#     'team'= '',
#     'points'= ''
# }
