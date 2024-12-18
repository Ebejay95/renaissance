# **************************************************************************** #
#                                                                              #
#                                                         :::      ::::::::    #
#    Makefile                                           :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: jeberle <jeberle@student.42.fr>            +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2024/11/26 12:56:51 by jeberle           #+#    #+#              #
#    Updated: 2024/12/18 10:27:55 by jeberle          ###   ########.fr        #
#                                                                              #
# **************************************************************************** #

#------------------------------------------------------------------------------#
#--------------                      COMPILE                      -------------#
#------------------------------------------------------------------------------#

all:
	@npm install
	@npm run start

container:
	@docker compose -f ./docker-compose.yml build
	@docker compose -f ./docker-compose.yml up -d
	@docker exec -it renaissance bash

prune:
	@docker stop renaissance || true
	@docker rm renaissance || true

.PHONY: all container prune