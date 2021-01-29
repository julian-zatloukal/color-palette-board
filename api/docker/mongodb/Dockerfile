FROM mongo

COPY ./docker/mongodb/mongo-init.sh /docker-entrypoint-initdb.d/mongo-init.sh

CMD [ "/docker-entrypoint-initdb.d/mongo-init.sh" ]