<template>
    <div>
        <h1 id="tableLabel">Country</h1>

        <div class="searchDiv">
        <label for="fname">Country:</label>
            <input type="text" v-model.trim="searchStr" @input="() => renderPageData()">
        </div>

        <p v-if="!allCountries"><em>Loading...</em></p>
        <table class='table table-striped' aria-labelledby="tableLabel" v-if="allCountries">
            <thead >
                <tr>
                    <th>Flag</th>
                    <th><a href="#" class="sort-by" @click="() => onNameColumnClick()"></a>Name</th>
                    <th>Alpha 2 Code</th>
                    <th>Alpha 3 Code</th>
                    <th>Native Name</th>
                    <th>Alt Spellings</th>
                    <th>Calling Codes</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="country of showCountries" v-bind:key="country">
                    <td><input type="image" v-bind:src="country.flag" class="imageInGrid"/></td>
                    <td><a data-toggle="modal" data-target="#countryModal" @click="() => this.selectedCountry = country">{{ country.name }}</a></td>
                    <td>{{ country.alpha2Code }}</td>
                    <td>{{ country.alpha3Code }}</td>
                    <td>{{ country.nativeName }}</td>
                    <td v-if="country.altSpellings.count <=1">{{ country.altSpellings[0] }}</td>
                    <td v-else>{{ country.altSpellings.join(",") }}</td>
                    <td v-if="country.callingCodes.count <=1">{{ country.callingCodes[0] }}</td>
                    <td v-else>{{ country.callingCodes.join(",") }}</td>
                </tr>
            </tbody>
        </table>
        <nav aria-label="Page navigation">
            <ul class="pagination">
                <li :class=" page == 1 ? 'page-item disabled' : 'page-item' ">
                    <a class="page-link" href="#" tabindex="-1" @click="() => onPageClick(page -1)">Previous</a>
                </li>
                
                <li v-if="page <= 2" :class="page == 1 ? 'page-item active' : 'page-item'" >
                    <a class="page-link" href="#" @click="() => onPageClick(1)">1<span v-if="page == 1" class="sr-only">(current)</span></a>
                </li>
                <li v-else-if="page == lastPage" :class="page == lastPage -2  ? 'page-item active' : 'page-item'" >
                    <a class="page-link" href="#" @click="() => onPageClick(lastPage - 2)">{{ lastPage -2 }}</a>
                </li>
                <li v-else class="page-item">
                    <a class="page-link" href="#" @click="() => onPageClick(page - 1)">{{ page -1 }}</a>
                </li>

                <!--second-->
                <li v-if="lastPage >=2 && page <= 2" :class="page == 2 ? 'page-item active' : 'page-item'" >
                    <a class="page-link" href="#" @click="() => onPageClick(2)">2<span v-if="page == 2" class="sr-only">(current)</span></a>
                </li>
                <li v-else-if="lastPage >=2 && (page != 2 && page == lastPage)" class="page-item" >
                    <a class="page-link" href="#" @click="() => onPageClick(lastPage - 1)">{{ lastPage -1 }}</a>
                </li>
                <li v-else-if="lastPage >=2" class="page-item active">
                    <a class="page-link" href="#" @click="() => onPageClick(page)">{{ page }}<span class="sr-only">(current)</span></a>
                </li>

                <!--third-->
                <li v-if="lastPage >=3 && page <= 2" :class="page == 3 ? 'page-item active' : 'page-item'" >
                    <a class="page-link" href="#" @click="() => onPageClick(3)">3<span v-if="page == 3" class="sr-only">(current)</span></a>
                </li>
                <li v-else-if="lastPage >=3 && (page != 3 && page == lastPage)" class="page-item active" >
                    <a class="page-link" href="#" @click="() => onPageClick(lastPage)">{{ lastPage }}<span class="sr-only">(current)</span></a>
                </li>
                <li v-else-if="lastPage >=3" class="page-item">
                    <a class="page-link" href="#" @click="() => onPageClick(page + 1 )">{{ page + 1}}</a>
                </li>

                <!--Next-->
                <li :class=" page == lastPage ? 'page-item disabled' : 'page-item' ">
                    <a class="page-link" href="#" tabindex="-1" @click="() => onPageClick(page + 1)">Next</a>
                </li>
            </ul>
        </nav>

        <div class="modal fade" tabindex="-1" id="countryModal" role="dialog" aria-hidden="true">
            <div class="modal-dialog modal-lg" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Country Detail</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div class="container">
                            <div class="row">
                                <div class="col">
                                    <div class="image">
                                        <img :src="selectedCountry.flag" class="imageInModal" />
                                    </div>
                                </div>
                                <div class="col">
                                    <div class="detail">
                                        <ul>
                                            <li>Name:{{ selectedCountry.name }}</li>
                                            <li>Alpha2Code:{{ selectedCountry.alpha2Code }}</li>
                                            <li>Alpha3Code:{{ selectedCountry.alpha3Code }}</li>
                                            <li>Capital:{{ selectedCountry.capital }}</li>
                                            <li>Region:{{ selectedCountry.region }}</li>
                                            <li>Population:{{ selectedCountry.population }}</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                    </div>
                </div>
            </div>
        </div>
    </div>    
</template>


<script>
    import axios from 'axios'
    export default {
        name: "FetchData",
        data() {
            return {
                allCountries: [],
                showCountries:[],
                lastPage:Number,
                pageSize:25,
                searchStr:"",
                page:1,
                selectedCountry : Object,
                isSortAsc:true,
            }
        },
        methods: {
            getAllCountry() {
                axios.get('https://restcountries.eu/rest/v2/all')
                    .then((response) => {
                        this.allCountries =  response.data;
                        this.renderPageData();
                    })
                    .catch(function (error) {
                        alert(error);
                    });
            },
            renderPageData(){
                var searchItems = this.allCountries;
                if(this.searchStr != undefined && this.searchStr.trim() == this.searchStr)
                    searchItems = searchItems.filter(country => country.name.toLowerCase().includes(this.searchStr.toLowerCase()));

                var startItemToGet = (this.page - 1) * this.pageSize;
                var isSortAsc = this.isSortAsc;
                this.showCountries = searchItems.sort(function(a,b){
                                                    return a.name.localeCompare(b.name) * (isSortAsc ? 1 : -1);
                                                })
                                                .slice(startItemToGet,startItemToGet + this.pageSize);
                Math.ceil(searchItems.length / this.pageSize);
                this.lastPage = Math.ceil(searchItems.length / this.pageSize);
            },           
            onPageClick(clickPage){
                console.log(clickPage);
                this.page = clickPage;
                this.renderPageData();
            },
            onNameColumnClick(){
                this.isSortAsc = !this.isSortAsc;
                this.renderPageData();
            }

        },
        counputed:{
        },
        mounted() {
            this.getAllCountry();
        }
    }
</script>

<style>
    .imageInGrid {
        display:inline;
        max-width:50px;
    }
    .imageInModal{
        
        display:inline;
        max-width:200px;
    }
    th a,
    td a { 
        display: block;
        width: 100%;
    }
    th a.sort-by { 
        padding-right: 18px;
        position: relative;
    }
    a.sort-by:before,
    a.sort-by:after {
        border: 4px solid transparent;
        content: "";
        display: block;
        height: 0;
        right: 5px;
        top: 50%;
        position: absolute;
        width: 0;
    }
    a.sort-by:before {
        border-bottom-color: #666;
        margin-top: -9px;
    }
    a.sort-by:after {
        border-top-color: #666;
        margin-top: 1px;
    }
</style>