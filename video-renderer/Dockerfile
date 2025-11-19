FROM ubuntu:22.04

RUN apt-get update && apt-get install -y ffmpeg curl python3 python3-pip && apt-get clean

WORKDIR /app

COPY requirements.txt .
RUN pip3 install -r requirements.txt

COPY server.py .

EXPOSE 8080
CMD ["python3", "server.py"]
