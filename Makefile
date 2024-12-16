# **************************************************************************** #
#                                                                              #
#                                                         :::      ::::::::    #
#    Makefile                                           :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: jonathaneberle <jonathaneberle@student.    +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2024/11/26 12:56:51 by jeberle           #+#    #+#              #
#    Updated: 2024/12/16 23:47:19 by jonathanebe      ###   ########.fr        #
#                                                                              #
# **************************************************************************** #

#------------------------------------------------------------------------------#
#--------------                      COMPILE                      -------------#
#------------------------------------------------------------------------------#

.PHONY: all clean fclean re

all:
	@npm i
	@npm run start


container-build:
	@if ! docker ps | grep -q webserv; then \
		echo "$(YELLOW)Building the container environment$(X)"; \
		docker compose -f ./docker-compose.yml build --no-cache; \
	else \
		echo "$(YELLOW)Container already built.. skip build process$(X)"; \
	fi

container-up:
	@if ! docker ps | grep -q renaissance; then \
		echo "$(YELLOW)Starting the container environment$(X)"; \
		docker compose -p renaissance -f ./docker-compose.yml up -d; \
	else \
		echo "$(YELLOW)Container already running.. skip its creation$(X)"; \
	fi

container:
	@make container-build
	@make container-up
	@docker exec -it renaissance bash

prune:
	@if docker ps -a | grep -q $(NAME); then \
		echo "$(RED)Removing existing container...$(X)"; \
		docker stop $(NAME) && docker rm $(NAME); \
	else \
		echo "$(YELLOW)No container named '$(NAME)' to remove.$(X)"; \
	fi
	@echo "$(GREEN)All done!$(X)"