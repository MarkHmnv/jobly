upstream django {
	server ${APP_HOST}:${APP_PORT};
}

server {
	listen ${LISTEN_PORT};

	location / {
		proxy_pass http://django;
	}

	location /static/ {
		alias /vol/static;
	}
}