require 'activeadmin-sortable/version'
require 'activeadmin'
require 'rails/engine'

module ActiveAdmin
  module Sortable
    module ControllerActions
      def sortable
        member_action :sort, :method => :post do
          if defined?(::Mongoid::Orderable) && 
            resource.class.included_modules.include?(::Mongoid::Orderable)
              resource.move_to! params[:position].to_i
          else
            resource.insert_at params[:position].to_i
          end
          head 200
        end
      end
    end

    module TableMethods
      HANDLE = Iconic.icon :move_alt1

      def sortable_handle_column
        column '', :class => "activeadmin-sortable" do |resource|
          sort_url = url_for([:sort, :admin, resource])
          content_tag :span, HANDLE, :class => 'handle', 'data-sort-url' => sort_url
        end
      end
    end

    ::ActiveAdmin::ResourceDSL.send(:include, ControllerActions)
    ::ActiveAdmin::Views::TableFor.send(:include, TableMethods)

    class Engine < ::Rails::Engine
      # Including an Engine tells Rails that this gem contains assets
    end
  end
end


