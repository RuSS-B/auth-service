FROM migrate/migrate:4
WORKDIR /db
COPY migrations /db/migrations

CMD ["/bin/sh"]