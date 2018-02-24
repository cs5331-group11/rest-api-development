#FROM ubuntu:latest
FROM nodeintegration/nginx-modsecurity

# init runit
RUN touch /etc/inittab
RUN apt-get update && DEBIAN_FRONTEND=noninteractive apt-get install -y -q runit


RUN apt-get update
RUN apt-get install -y python-pip
RUN pip install -r requirements.txt
#RUN echo "ServerName localhost  " >> /etc/apache2/apache2.conf
RUN echo "$user     hard    nproc       100" >> /etc/security/limits.conf
ADD ./src/service /service
ADD ./src/html /var/www/html
ADD ./conf/cs5331_db.conf /cs5331_db.conf
EXPOSE 80
EXPOSE 8080
#CMD ["/bin/bash", "/service/start_services.sh"]

# nginx cleanup
RUN rm -fv /etc/nginx/conf.d/default.conf

# nginx apps
COPY ./resources/nginx/* /etc/nginx/conf.d/

# copy services
COPY resources/service /etc/service
RUN find /etc -name run
RUN chmod +x /etc/service/*/run

# setup runit
COPY ./resources/sbin/runit_bootstrap /usr/sbin/runit_bootstrap
RUN chmod 755 /usr/sbin/runit_bootstrap
ENTRYPOINT ["/usr/sbin/runit_bootstrap"]
