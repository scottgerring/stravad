# Build tippecanoe, which we need for our mbtiling 
FROM ruby:3.0.0 as builder

RUN apt-get update \
  && apt-get -y install git build-essential libsqlite3-dev zlib1g-dev

RUN git clone -b 1.36.0 https://github.com/mapbox/tippecanoe.git
RUN cd tippecanoe && make && make install 

#
# Build our runtime image
#
FROM ruby:3.0.0

RUN apt-get update \ 
    && apt-get -y install libsqlite3-0 zlib1g jq \
    && apt-get clean

RUN apt-get update \ 
    && apt-get -y install libsqlite3-0 zlib1g jq \
    && apt-get clean

ENV BUNDLE_PATH /box
ENV GEM_PATH /box
ENV GEM_HOME /box

WORKDIR /app
COPY Gemfile Gemfile.lock ./
COPY  --from=builder  /tippecanoe/tippecanoe /usr/local/bin/tippecanoe
RUN gem install bundler:2.2.3
RUN bundle install
ADD *.rb . 
ADD *.sh .
RUN mkdir activites
RUN mkdir activities-complete

CMD ["/bin/bash", "/app/fetch.sh"]
