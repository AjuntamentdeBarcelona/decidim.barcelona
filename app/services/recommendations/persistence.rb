# Handles the persistence of user recommendations in the database
class Recommendations::Persistence
  KEY_PREFIX = "recommendations_for_user"
  KEY_EXPIRATION_IN_SECONDS = 1.day.to_i

  # Static
  #
  # Check if the user recommendations had been already loaded and not expired.
  # In case the recommendations had expired then it uses the Engine to
  # get user recommendations
  #
  # user - The user object to fetch recomendations for
  def self.fetch_recommendations_for(user)
    user_key = "#{KEY_PREFIX}_#{user.id}"

    unless $redis.exists user_key
      $redis.set user_key, true
      $redis.expire user_key, KEY_EXPIRATION_IN_SECONDS

      store = Recommendations::RedisMatrixStore.new("user_preferences")
      pref_matrix = Recommendations::PreferencesMatrix.new(store).load

      subject_id = user.id.to_s
      object_ids = Proposal.pluck(:id).map(&:to_s)
      exclude_object_ids = Proposal.where(author_id: user.id).pluck(:id).map(&:to_s) + 
        Vote.where(voter_id: user.id, voter_type: 'User', votable_type: 'Proposal').pluck(:votable_id).map(&:to_s)

      recommendations = Recommendations::Engine.get_recommendations(pref_matrix, subject_id, object_ids, exclude_object_ids)

      User.transaction do
        Recommendation.where(user_id: subject_id).delete_all

        recommendations.each do |data|
          Recommendation.create(user_id: subject_id, proposal_id: data[1], score: data[0])
        end
      end
    end
  end
end
