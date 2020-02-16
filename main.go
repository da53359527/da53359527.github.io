package main

import (
	"log"
	"net/http"

	"github.com/gorilla/mux"
)

func main() {
	var listenPort string
	listenPort = "8788"
	r := mux.NewRouter()
	r.PathPrefix("/").Handler(http.FileServer(http.Dir("./app/")))
	log.Printf("Listen on port: %+v\n", listenPort)
	log.Fatal(http.ListenAndServe(":"+listenPort, r))
}
