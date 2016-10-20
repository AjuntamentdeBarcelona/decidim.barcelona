class Verification::ResidenceController < ApplicationController
  include HasParticipatoryProcess
  before_action :authenticate_user!
  before_action :verify_verified!
  before_action :verify_lock, only: [:new, :create]
  skip_authorization_check

  def new
    @residence = Verification::Residence.new
  end

  def create
    @residence = Verification::Residence.new(residence_params.merge(user: current_user))
    if @residence.save
      redirect_to account_path, notice: t('verification.residence.create.flash.success')
    else
      render :new
    end
  end

  private

    def residence_params
      params.require(:residence).permit(:document_number, :document_type, :date_of_birth, :postal_code, :adult_verification, :terms_of_service)
    end
end
