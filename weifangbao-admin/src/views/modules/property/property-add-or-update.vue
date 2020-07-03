<template>
  <el-dialog width="60%" :visible.sync="visible" :title="!dataForm.id ? $t('add') : $t('update')"
             :close-on-click-modal="false"
             :close-on-press-escape="false"
             :before-close="Close">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmitHandle()"
             :label-width="$i18n.locale === 'en-US' ? '150px' : '120px'">
      <el-form-item label="效果图:" prop="designPictures">
        <div class="allPic" style="display: inline-block;" v-for="(item,index) in designPictures" :key="index">
          <img :src="item" :alt="item">
          <div class="delete">
            <i @click="deleteDesignPictures(index)" class="el-icon-delete"></i>
          </div>
        </div>
        <el-upload
            style="display: block"
            :action="addressOss"
            :headers="dataOss"
            list-type="fileList"
            :show-file-list="false"
            :on-success="getImgUrl"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove">
          <el-button size="small" type="primary">点击上传</el-button>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible" size="tiny">
          <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>
      </el-form-item>
      <el-form-item label="区域:" prop="areaName">
        <el-row>
          <el-col style="margin-right: 10px" :span="6">
            <el-select v-model="city" placeholder="请选择城市" @change="getAreaList">
              <el-option
                  v-for="item in cityList"
                  :key="item.id"
                  :label="item.regionName"
                  :value="item.id">
              </el-option>
            </el-select>
          </el-col>
          <el-col :span="6">
            <el-select v-model="area" placeholder="请选择地区" @change="getAreaData">
              <el-option
                  v-for="item in areaList"
                  :key="item.id"
                  :label="item.regionName"
                  :value="item.id">
              </el-option>
            </el-select>
          </el-col>
        </el-row>
      </el-form-item>
      <el-row>
        <el-col :span="12">
          <el-form-item label="楼盘管理员ID:" prop="unionId">
            <el-input v-model="dataForm.unionId" placeholder="多个用‘,’分割，如：1234,1235"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="楼盘名称:" prop="propertyName">
            <el-input v-model="dataForm.propertyName" placeholder="楼盘名称"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="楼盘别名:" prop="propertyAliasName">
            <el-input v-model="dataForm.propertyAliasName" placeholder="楼盘别名"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="楼盘特色:" prop="propertyCharacteristics">
            <el-input v-model="dataForm.propertyCharacteristics" placeholder="楼盘特色"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="参考均价:" prop="unitPrice">
            <el-input v-model="dataForm.unitPrice" placeholder="参考均价">
              <template slot="append">元</template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="参考总价:" prop="totalPrice">
            <el-input v-model="dataForm.totalPrice" placeholder="参考总价">
              <template slot="append">万元</template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="佣金:" prop="commission">
            <el-input v-model="dataForm.commission" placeholder="佣金">
              <!--              <template slot="append">元</template>-->
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="建筑结构:" prop="buildingStructure">
            <el-select v-model="buildingStructureList" multiple placeholder="请选择" style="width:100%;">
              <el-option
                  v-for="item in buildingStructure"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="楼盘简介:" prop="propertyIntroduce">
        <el-input type="textarea" :rows="5" v-model="dataForm.propertyIntroduce" placeholder="楼盘简介"></el-input>
      </el-form-item>
      <el-form-item label="建筑面积" prop="buildingArea">
        <div class="block">
          <el-slider
              v-model="buildArea"
              :step="10"
              range
              show-stops
              :min="10"
              :max="500">
          </el-slider>
        </div>
      </el-form-item>
      <el-form-item label="楼盘地址:" prop="propertyAddress">
        <el-input v-model="dataForm.propertyAddress" placeholder="楼盘地址">
          <el-button slot="append" icon="el-icon-search" @click="addressKeyword=dataForm.propertyAddress"></el-button>
        </el-input>
        <div class="map">
          <baidu-map
              :scroll-wheel-zoom="false"
              :center="location"
              :zoom="zoom"
              @ready="mapReady"
              @click="getLocationPoint">
            <bm-marker
                v-if="show == true"
                :position="marklocation"
                :dragging="true"
                @click="infoWindowOpen">
              <bm-info-window @close="infoWindowClose" @open="infoWindowOpen"></bm-info-window>
            </bm-marker>
            <bm-geolocation anchor="BMAP_ANCHOR_BOTTOM_RIGHT" :showAddressBar="true" :autoLocation="true"></bm-geolocation>
            <bm-view style=" height:300px;"></bm-view>
            <bm-local-search v-if="addressKeyword != ''" :keyword="addressKeyword" :auto-viewport="true"></bm-local-search>
            <bm-navigation anchor="BMAP_ANCHOR_TOP_LEFT"></bm-navigation>
          </baidu-map>
        </div>
      </el-form-item>
      <el-form-item label="户型图:" prop="apartmentPictures">
        <div class="allPic2" style="display: inline-block;" v-for="(item,index) in apartmentPictures"
             :key="index">
          <img :src="item.picture" :alt="item">
          <el-input v-model="item.model" placeholder="请输入户型信息"></el-input>
          <el-input v-model="item.desc" placeholder="请输入描述信息"></el-input>
          <div class="delete2">
            <i @click="deleteApartmentPictures(index)" class="el-icon-delete"></i>
          </div>
        </div>
        <el-upload
            style="display: block"
            :action="addressOss"
            :headers="dataOss"
            list-type="fileList"
            :show-file-list="false"
            :on-success="getImgUrla"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove">
          <el-button size="small" type="primary">点击上传</el-button>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible" size="tiny">
          <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>
      </el-form-item>
      <el-form-item label="标签:" prop="labels">
        <div>
          <span class="tags" v-for="item in getTagList" :key="item.id" :class="{changeTag:item.selected}"
                @click="addTag(item)">{{item.dictName}}</span>
        </div>
      </el-form-item>

      <div class="box-border">
        <p class="title">销售信息</p>
        <el-row>
          <el-col :span="12">
            <el-form-item label="售卖楼栋:" prop="saleBuilding">
              <el-input v-model="dataForm.saleBuilding" placeholder="售卖楼栋"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="售卖户型:" prop="saleApartment">
              <el-select v-model="saleApartmentList" multiple placeholder="请选择" style="width:100%;">
                <el-option
                    v-for="item in saleApartment"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="开盘时间:" prop="openingDate">
              <el-date-picker
                  v-model="dataForm.openingDate"
                  type="date"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  placeholder="选择日期时间">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="最新交房:" prop="latestHand">
              <el-date-picker
                  v-model="dataForm.latestHand"
                  type="date"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  placeholder="选择日期时间">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="最新开盘:" prop="latestOpening">
              <el-date-picker
                  v-model="dataForm.latestOpening"
                  type="date"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  placeholder="选择日期时间">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="售卖状态:" prop="saleStatus">
              <el-select v-model="dataForm.saleStatus" clearable filterable placeholder="请选择">
                <el-option
                    v-for="(item,index) in saleStatus"
                    :key="index"
                    :label="item.dictName"
                    :value="item.dictName">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </div>
      <div class="box-border">
        <p class="title">小区概况</p>
        <el-row>
          <el-col :span="12">
            <el-form-item label="占地面积:" prop="coverArea">
              <el-input v-model="dataForm.coverArea" placeholder="占地面积">
                <template slot="append">㎡</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="建筑面积:" prop="buildingArea">
              <el-input v-model="dataForm.buildingArea" placeholder="建筑面积">
                <template slot="append">㎡</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="容积率:" prop="plotRatio">
              <el-input v-model="dataForm.plotRatio" placeholder="容积率">
                <template slot="append">%</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="绿化率:" prop="afforestationRatio">
              <el-input v-model="dataForm.afforestationRatio" placeholder="绿化率">
                <template slot="append">%</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="规划车位:" prop="planPark">
              <el-input v-model="dataForm.planPark" placeholder="规划车位"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="车位配比:" prop="parkRatio">
              <el-input v-model="dataForm.parkRatio" placeholder="车位配比"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="规划楼栋:" prop="planBuilding">
              <el-input v-model="dataForm.planBuilding" placeholder="规划楼栋">
                <template slot="append">栋</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="规划户数:" prop="planHouseholds">
              <el-input v-model="dataForm.planHouseholds" placeholder="规划户数">
                <template slot="append">户</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="开发商:" prop="developer">
              <el-input v-model="dataForm.developer" placeholder="开发商">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="物业公司:" prop="propertyCompany">
              <el-input v-model="dataForm.propertyCompany" placeholder="物业公司"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="物业类型:" prop="propertyType">
              <el-input v-model="dataForm.propertyType" placeholder="物业公司"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="物业费用:" prop="propertyCost">
              <el-input v-model="dataForm.propertyCost" placeholder="物业费用">
                <template slot="append">元/月/㎡</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="产权年限:" prop="propertyRightYears">
              <el-input v-model="dataForm.propertyRightYears" placeholder="产权年限">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="装修标准:" prop="decorationStandard">
              <el-input v-model="dataForm.decorationStandard" placeholder="装修标准"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="供暖方式:" prop="heatingMode">
              <el-input v-model="dataForm.heatingMode" placeholder="供暖方式"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="供水:" prop="waterSupply">
              <el-input v-model="dataForm.waterSupply" placeholder="供水"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="供电:" prop="powerSupply">
              <el-input v-model="dataForm.powerSupply" placeholder="供电"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </div>
      <div class="box-border">
        <p class="title">预售许可证
          <el-button size="small" type="primary" @click="innerVisible = true">添加</el-button>
        </p>
        <el-table header-align="center" align="center"
                  :data="preSalePermitTableData"
                  border
                  style="width: 100%">
          <el-table-column header-align="center" align="center"
                           prop="preSaleCard"
                           label="预售证号">
          </el-table-column>
          <el-table-column header-align="center" align="center"
                           prop="preSaleDate"
                           label="发证时间">
          </el-table-column>
          <el-table-column header-align="center" align="center"
                           prop="preSaleHouse"
                           label="绑定楼栋">
          </el-table-column>
          <el-table-column header-align="center" align="center"
                           label="操作"
                           width="100">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="changeSalePermit(scope.row,scope.$index)">修改</el-button>
              <el-button type="text" size="small" @click="deleteSalePermit(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

    </el-form>
    <template slot="footer">
      <el-button @click="closeThisDialog()">{{ $t('cancel') }}</el-button>
      <el-button type="primary" @click="dataFormSubmitHandle()">{{ $t('confirm') }}</el-button>
    </template>
    <el-dialog
        width="30%"
        title="添加许可证"
        :visible.sync="innerVisible"
        append-to-body>
      <el-form ref="preSalePermit" :model="preSalePermit" label-width="80px">
        <el-form-item label="预售证号" :label-width="formLabelWidth">
          <el-input v-model="preSalePermit.preSaleCard" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="发证时间" :label-width="formLabelWidth">
          <el-date-picker
              v-model="preSalePermit.preSaleDate"
              type="datetime"
              placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="绑定楼栋" :label-width="formLabelWidth">
          <el-input v-model="preSalePermit.preSaleHouse" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeSalePermit()">取 消</el-button>
        <el-button type="primary" @click="addSalePermit()">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog
        width="30%"
        title="修改许可证"
        :visible.sync="changeVisible"
        append-to-body>
      <el-form ref="preSalePermit" :model="preSalePermitChange" label-width="80px">
        <el-form-item label="预售证号" :label-width="formLabelWidth">
          <el-input v-model="preSalePermitChange.preSaleCard " autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="发证时间" :label-width="formLabelWidth">
          <el-date-picker
              v-model="preSalePermitChange.preSaleDate "
              type="datetime"
              placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="绑定楼栋" :label-width="formLabelWidth">
          <el-input v-model="preSalePermitChange.preSaleHouse" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeSalePermit()">取 消</el-button>
        <el-button type="primary" @click="ChangeSubmit()">确 定</el-button>
      </div>
    </el-dialog>
  </el-dialog>
</template>

<script>
    import debounce from 'lodash/debounce'

    export default {
        data(){
            return {
                show                  :false,
                location              :{
                    lng:"116.404476",
                    lat:"39.914687"
                },
                formLabelWidth        :'120px',
                innerVisible          :false,
                changeVisible         :false,
                addressOss            :"",
                dataOss               :{},
                zoom                  :13,
                addressKeyword        :"",
                address               :"",
                marklocation          :{},
                dialogImageUrl        :'',
                dialogVisible         :false,
                visible               :false,
                dataForm              :{
                    id                     :'',
                    unionId                :'',
                    pareaId                :'',
                    pareaName              :'',
                    areaId                 :'',
                    areaName               :'',
                    propertyName           :'',
                    propertyAliasName      :'',
                    propertyIntroduce      :'',
                    propertyAddress        :'',
                    propertyCharacteristics:'',
                    minBuildArea           :'',
                    maxBuildArea           :'',
                    unitPrice              :'',
                    totalPrice             :'',
                    commission             :'',
                    buildingStructure      :'',
                    openingDate            :'',
                    saleStatus             :'',
                    saleApartment          :'',
                    saleAddress            :'',
                    designPictures         :'',
                    apartmentPictures      :'',
                    labels                 :'',
                    propertyType           :'',
                    decorationStandard     :'',
                    propertyRightYears     :'',
                    developer              :'',
                    saleBuilding           :'',
                    latestOpening          :'',
                    latestHand             :'',
                    coverArea              :'',
                    buildingArea           :'',
                    plotRatio              :'',
                    afforestationRatio     :'',
                    planPark               :'',
                    parkRatio              :'',
                    planBuilding           :'',
                    planHouseholds         :'',
                    propertyCompany        :'',
                    propertyCost           :'',
                    heatingMode            :'',
                    waterSupply            :'',
                    powerSupply            :'',
                    preSalePermit          :'',
                    propertyStatus         :'',
                    remark                 :'',
                    sort                   :'',
                    createDate             :'',
                    updateDate             :'',
                    creator                :'',
                    updater                :'',
                    isDeleted              :'',
                    addressLon             :'',
                    addressLat             :''
                },
                designPictures        :[],
                apartmentPictures     :[],
                buildArea             :[0, 300],
                tableData             :[],
                areaOptions           :[],
                areaProps             :{
                    lazy :false,
                    value:"id",
                    label:"regionName",
                    //lazyLoad: this.regionLazyLoad
                },
                cityList              :[],  //城市列表
                city                  :'',  //选中的城市
                areaList              :[],  //地区列表
                area                  :'',  //选中的地区
                labelsTags            :[],  //选中的标签
                getTagList            :[], //获取的标签列表
                areaData              :[],
                buildingStructure     :[], //建筑结构
                buildingStructureList :[],
                saleApartment         :[], //售卖户型
                saleApartmentList     :[],
                saleStatus            :[], //售卖户型
                inputVisible          :false,
                inputValue            :'',
                preSalePermit         :{preSaleCard:"", preSaleDate:"", preSaleHouse:""},  //添加的许可证
                preSalePermitChange   :{preSaleCard:"", preSaleDate:"", preSaleHouse:""},  //修改的许可证
                premitList            :[],
                preSalePermitTableData:[], //表格许可证数据
                index                 :0
            }
        },
        computed:{
            // 必选项设置
            dataRule(){
                return {
                    unionId                :[
                        {required:true, message:this.$t('validate.required'), trigger:'blur'}
                    ],
                    areaId                 :[
                        {required:true, message:this.$t('validate.required'), trigger:'blur'}
                    ],
                    areasName              :[
                        {required:true, message:this.$t('validate.required'), trigger:'blur'}
                    ],
                    propertyName           :[
                        {required:true, message:this.$t('validate.required'), trigger:'blur'}
                    ],
                    propertyAddress        :[
                        {required:true, message:this.$t('validate.required'), trigger:'blur'}
                    ],
                    propertyCharacteristics:[
                        {required:true, message:this.$t('validate.required'), trigger:'blur'}
                    ],
                    minBuildArea           :[
                        {required:true, message:this.$t('validate.required'), trigger:'blur'}
                    ],
                    maxBuildArea           :[
                        {required:true, message:this.$t('validate.required'), trigger:'blur'}
                    ],
                    unitPrice              :[
                        {required:true, message:this.$t('validate.required'), trigger:'blur'}
                    ],
                    totalPrice             :[
                        {required:true, message:this.$t('validate.required'), trigger:'blur'}
                    ],
                    commission             :[
                        {required:true, message:this.$t('validate.required'), trigger:'blur'}
                    ],
                    saleStatus             :[
                        {required:true, message:this.$t('validate.required'), trigger:'blur'}
                    ],
                    saleApartment          :[
                        {required:true, message:this.$t('validate.required'), trigger:'blur'}
                    ],
                    saleAddress            :[
                        {required:true, message:this.$t('validate.required'), trigger:'blur'}
                    ],
                    designPictures         :[
                        {required:true, message:this.$t('validate.required'), trigger:'blur'}
                    ],
                    propertyType           :[
                        {required:true, message:this.$t('validate.required'), trigger:'blur'}
                    ],
                    decorationStandard     :[
                        {required:true, message:this.$t('validate.required'), trigger:'blur'}
                    ],
                    propertyRightYears     :[
                        {required:true, message:this.$t('validate.required'), trigger:'blur'}
                    ],
                    developer              :[
                        {required:true, message:this.$t('validate.required'), trigger:'blur'}
                    ],
                    preSalePermit          :[
                        {required:true, message:this.$t('validate.required'), trigger:'blur'}
                    ],
                    propertyStatus         :[
                        {required:true, message:this.$t('validate.required'), trigger:'blur'}
                    ],
                    remark                 :[
                        {required:true, message:this.$t('validate.required'), trigger:'blur'}
                    ],
                    sort                   :[
                        {required:true, message:this.$t('validate.required'), trigger:'blur'}
                    ],
                    updateDate             :[
                        {required:true, message:this.$t('validate.required'), trigger:'blur'}
                    ],
                    updater                :[
                        {required:true, message:this.$t('validate.required'), trigger:'blur'}
                    ],
                    isDeleted              :[
                        {required:true, message:this.$t('validate.required'), trigger:'blur'}
                    ]
                }
            },
        },
        created(){
            this.addressOss = window.SITE_CONFIG['OPEN_API_HOME'] + "/sys/oss/upload";//上传地址
            this.dataOss    = {
                key:window.SITE_CONFIG['OPEN_API_KEY'],
            };//上传额外参数
            this.$http.get('/property/propertyregion/list?parentId=0').then(({data:res}) => {
                if(res.code !== 0){
                    return this.$message.error(res.msg)
                }
                this.cityList = res.data
            }).catch(() => {
            })  //获取区域
            this.$http.get('common/dictList?pid=1099945308021941003').then(({data:res}) => {
                if(res.code !== 0){
                    return this.$message.error(res.msg)
                }
                this.saleStatus = res.data
            }).catch(() => {
            })  //获取销售状态
            this.$http.get('common/dictList?pid=1099945308021941002').then(({data:res}) => {
                if(res.code !== 0){
                    return this.$message.error(res.msg)
                }
                for(let i = 0; i < res.data.length; i++){
                    this.buildingStructure.push({label:res.data[i].dictName, value:res.data[i].dictName})
                }
            }).catch(() => {
            })  //获取建筑结构
            this.$http.get('common/dictList?pid=1099945308021941004').then(({data:res}) => {
                if(res.code !== 0){
                    return this.$message.error(res.msg)
                }
                for(let i = 0; i < res.data.length; i++){
                    this.saleApartment.push({label:res.data[i].dictName, value:res.data[i].dictName})
                }
            }).catch(() => {
            })  //获取售卖户型
            // this.getTags()
        },
        methods :{
            // 获取城市列表
            getAreaList(e){
                let obj                 = {};
                obj                     = this.cityList.find((item) => {//这里的userList就是上面遍历的数据源
                    return item.id === e;//筛选出匹配数据
                });
                this.dataForm.pareaId   = obj.id
                this.dataForm.pareaName = obj.regionName
                // console.log("选中的城市数据", obj.id, obj.regionName);//我这边的name就是对应label的
                this.$http.get('/property/propertyregion/list?parentId=' + e).then(({data:res}) => {
                    if(res.code !== 0){
                        return this.$message.error(res.msg)
                    }
                    this.area     = ''
                    this.areaList = res.data
                }).catch(() => {
                })  //获取区域
            },
            // 获取区域数据
            getAreaData(e){
                let obj                = {};
                obj                    = this.areaList.find((item) => {//这里的userList就是上面遍历的数据源
                    return item.id === e;//筛选出匹配数据
                });
                this.dataForm.areaId   = obj.id
                this.dataForm.areaName = obj.regionName
                // console.log("选中的地区数据", obj.id, obj.regionName);//我这边的name就是对应label的
            },
            //获取标签
            getTags(){
                this.getTagList=[];
                this.$http.get('common/dictList?pid=1099945308021941005').then(({data:res}) => {
                    if(res.code !== 0){
                        return this.$message.error(res.msg)
                    }
                    for(let i = 0; i < res.data.length; i++){
                        this.getTagList.push({dictName:res.data[i].dictName, selected:false})
                    }
                    // console.log("结构", this.getTagList)
                }).catch(() => {
                })  //获取标签
            },
            // 添加标签
            addTag(item){
                if(!item.selected){
                    item.selected = true
                    this.labelsTags.push(item.dictName)
                }else if(item.selected){
                    item.selected = false
                    const i       = this.labelsTags.indexOf(item.dictName)
                    this.labelsTags.splice(i, 1)
                }
            },
            // 获取要修改的许可证数据
            changeSalePermit(row, index){
                this.changeVisible       = true
                this.index               = index
                this.preSalePermitChange = Object.assign({}, row)
                console.log("赋值的数据", this.preSalePermitChange)
            },
            // 删除许可证
            deleteSalePermit(data){
                this.preSalePermitTableData.splice(data, 1)
            },
            // 提交修改
            ChangeSubmit(){
                this.preSalePermitChange.preSaleDate = this.formatDate(this.preSalePermitChange.preSaleDate)
                this.preSalePermitTableData.splice(this.index, 1, this.preSalePermitChange)
                this.changeVisible       = false
                this.preSalePermitChange = {preSaleCard:"", preSaleDate:"", preSaleHouse:""}
                this.Close(() => {});
            },
            // 添加许可证
            addSalePermit(){
                if(this.dataForm.preSalePermit == null){
                    this.preSalePermitTableData = []
                }
                this.preSalePermit.preSaleDate = this.formatDate(this.preSalePermit.preSaleDate)
                this.preSalePermitTableData.push(this.preSalePermit)
                this.innerVisible  = false
                this.preSalePermit = {preSaleCard:"", preSaleDate:"", preSaleHouse:""}
            },
            closeSalePermit(){
                this.innerVisible        = false
                this.changeVisible       = false
                this.preSalePermit       = {preSaleCard:"", preSaleDate:"", preSaleHouse:""}
                this.preSalePermitChange = {preSaleCard:"", preSaleDate:"", preSaleHouse:""}
            },
            // 删除图片
            deleteDesignPictures(index){
                this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                    confirmButtonText:'确定',
                    cancelButtonText :'取消',
                    type             :'warning'
                }).then(() => {
                    this.designPictures.splice(index, 1)
                    this.$message({
                        type   :'success',
                        message:'删除成功!'
                    });
                }).catch(() => {
                });
            },
            deleteApartmentPictures(index){
                this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                    confirmButtonText:'确定',
                    cancelButtonText :'取消',
                    type             :'warning'
                }).then(() => {
                    this.apartmentPictures.splice(index, 1)
                    this.$message({
                        type   :'success',
                        message:'删除成功!'
                    });
                }).catch(() => {
                });
            },
            infoWindowClose(){
                this.show = false;
            },
            infoWindowOpen(){
                this.show = true;
            },
            mapReady({BMap, map}){
                const _this     = this;
                // 获取自动定位方法
                var geolocation = new BMap.Geolocation();
                // 获取逆解析方法实例
                this.myGeo      = new BMap.Geocoder();
                // 获取自动定位获取的坐标信息
                geolocation.getCurrentPosition(
                  function(r){
                      _this.location = {
                          lng:r.point.lng,
                          lat:r.point.lat
                      };
                      _this.point    = {
                          lng:r.point.lng,
                          lat:r.point.lat
                      };
                  },
                  {enableHighAccuracy:true}
                );
            },
            // 获取点击坐标
            getLocationPoint(e){
                this.lng = e.point.lng;
                this.lat = e.point.lat;
              /* 创建地址解析器的实例 */
                let geoCoder = new BMap.Geocoder();
              /* 获取位置对应的坐标 */
                geoCoder.getPoint(this.addressKeyword, point => {
                    this.selectedLng = point.lng;
                    this.selectedLat = point.lat;
                });
              /* 利用坐标获取地址的详细信息 */
                geoCoder.getLocation(e.point, res => {
                    this.dataForm.addressLon = res.point.lng
                    this.dataForm.addressLat = res.point.lat
                    this.marklocation        = res.point;
                    this.show                = true;
                });
            },
            handleRemove(file, fileList){
                // console.log(file, fileList);
            },
            //
            Close(done){
                console.error("关闭弹窗事件");
                this.addressKeyword = '';
                done();
            },
            closeThisDialog(){
                this.visible           = false
                this.designPictures    = []
                this.apartmentPictures = []
                this.getTagList        = []
            },
            // 上传图片
            handlePictureCardPreview(file){
                this.dialogImageUrl = file.url;
                this.dialogVisible  = true;
            },
            // 获取图片路径
            getImgUrl(response, file, fileList){
                this.designPictures.push(response.data.src)
            },
            getImgUrla(response, file, fileList){
                this.apartmentPictures.push({"picture":response.data.src, "desc":""})
            },
            // 时间格式转换
            formatDate(date){
                // 判断时间是否已转换为字符串格式
                if(date == null || date == '' || (date instanceof String) || (typeof date).toLowerCase() == 'string'){
                    return date
                }else{
                    let y      = date.getFullYear();
                    let m      = date.getMonth() + 1;
                    m          = m < 10 ? ('0' + m) : m;
                    let d      = date.getDate();
                    d          = d < 10 ? ('0' + d) : d;
                    let h      = date.getHours();
                    let minute = date.getMinutes();
                    minute     = minute < 10 ? ('0' + minute) : minute;
                    let second = date.getSeconds();
                    second     = minute < 10 ? ('0' + second) : second;
                    return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second;
                }
            },
            init(){
                this.visible = true
                this.$nextTick(() => {
                    this.$refs['dataForm'].resetFields()
                    if(this.dataForm.id){
                        this.getInfo()
                        this.getTags()
                    }
                })
            },
            // 获取信息
            getInfo(){
                this.$http.get(`/property/property/${this.dataForm.id}`).then(({data:res}) => {
                    if(res.code !== 0){
                        return this.$message.error(res.msg)
                    }
                    this.dataForm               = {
                        ...this.dataForm,
                        ...res.data
                    }
                    // console.log(this.dataForm)
                    this.area                   = this.dataForm.areaName
                    this.city                   = this.dataForm.pareaName
                    this.premitList             = JSON.parse(this.dataForm.preSalePermit)
                    this.dataForm.preSalePermit = JSON.parse(this.dataForm.preSalePermit)
                    this.preSalePermitTableData = this.dataForm.preSalePermit
                    // console.log(this.dataForm.preSalePermit)
                    this.designPictures         = JSON.parse(this.dataForm.designPictures) //图片
                    this.apartmentPictures      = JSON.parse(this.dataForm.apartmentPictures) //图片
                    // console.log(this.apartmentPictures)
                    this.buildingStructureList = this.dataForm.buildingStructure.split(",")  //建筑结构
                    this.saleApartmentList     = this.dataForm.saleApartment.split(",")  //售卖户型
                    this.labelsTags            = this.dataForm.labels.split(",") //标签
                    // console.log("获取的标签:", this.labelsTags, this.labelsTags[1])
                    for(let i = 0; i < this.getTagList.length; i++){
                        for(let j = 0; j < this.labelsTags.length; j++){
                            if(this.getTagList[i].dictName == this.labelsTags[j]){
                                this.getTagList[i].selected = true
                            }
                        }
                    }
                    // console.log("修改后的标签", this.getTagList)
                    this.buildArea = [this.dataForm.minBuildArea, this.dataForm.maxBuildArea] //面积

                    this.marklocation = {
                        lng:this.dataForm.addressLon,
                        lat:this.dataForm.addressLat
                    };
                    this.show         = true;
                    this.location     = {
                        lng:this.dataForm.addressLon,
                        lat:this.dataForm.addressLat
                    };

                }).catch(() => {
                })
            },
            // 表单提交
            dataFormSubmitHandle:debounce(function(){
                // console.log(this.dataForm)
                this.dataForm.labels            = this.labelsTags.join(",")
                this.getTagList                 = []
                // console.log("标签", this.dataForm.labels)
                this.dataForm.areaName          = JSON.stringify(this.areaData)
                this.dataForm.buildingStructure = this.buildingStructureList.toString()  //建筑结构
                this.dataForm.saleApartment     = this.saleApartmentList.toString()  //售卖户型
                this.dataForm.openingDate       = this.formatDate(this.dataForm.openingDate)  //开盘时间
                this.dataForm.latestHand        = this.formatDate(this.dataForm.latestHand)  //最新交房
                // console.log(this.dataForm.preSalePermit)
                this.dataForm.preSalePermit     = JSON.stringify(this.preSalePermitTableData)
                this.dataForm.designPictures    = JSON.stringify(this.designPictures)  //图片
                this.dataForm.apartmentPictures = JSON.stringify(this.apartmentPictures)  //图片
                // console.log(this.dataForm)
                this.$refs['dataForm'].validate((valid) => {
                    if(!valid){
                        return false
                    }
                    this.$http[!this.dataForm.id ? 'post' : 'put']('/property/property', this.dataForm).then(({data:res}) => {
                        if(res.code !== 0){
                            return this.$message.error(res.msg)
                        }
                        this.$message({
                            message :this.$t('prompt.success'),
                            type    :'success',
                            duration:500,
                            onClose :() => {
                                this.visible = false
                                this.$emit('refreshDataList')
                            }
                        })
                        this.Close(() => {});
                    }).catch(() => {
                    })
                })
            }, 1000, {'leading':true, 'trailing':false}),
            // 选择区域方法
            regionLazyLoad(node, resolve){
                const {data} = node;
                if(!data){
                    return resolve([]);
                }
                this.$http.get('/property/propertyregion/list?parentId=' + data.id).then(({data}) => {
                    resolve(data.data);
                }).catch(() => {
                }).finally(() => {
                    resolve([]);
                })
            },
            // 选择区域回调函数
            getArea(e){
                let labelValue       = this.$refs['areaCascader'].getCheckedNodes()[0].pathLabels
                this.dataForm.areaId = e[1]
                this.areaData        = labelValue
                // console.log(this.areaData)
            }
        },
    }
</script>
<style scoped>
  .box-border{
    border        :1px solid #c0ccda;
    border-radius :6px;
    margin-bottom :10px;
    padding       :10px;
  }

  .list{
    width    :50px;
    height   :60px;
    position :absolute;
    top      :100px;
    z-index  :1000;
  }

  .allPic{
    background-color   :#fbfdff;
    border             :1px dashed #c0ccda;
    border-radius      :6px;
    -webkit-box-sizing :border-box;
    box-sizing         :border-box;
    width              :170px;
    height             :85px;
    margin             :0 8px 8px 0;
  }

  .allPic2{
    background-color   :#fbfdff;
    border             :1px dashed #c0ccda;
    border-radius      :6px;
    -webkit-box-sizing :border-box;
    box-sizing         :border-box;
    width              :170px;
    height             :170px;
    margin             :0 8px 8px 0;
  }

  .allPic img{
    width  :100%;
    height :100%;
  }

  .allPic2 img{
    width  :100%;
    height :100%;
  }

  .delete{
    position    :absolute;
    width       :170px;
    height      :85px;
    line-height :85px;
    text-align  :center;
    font-size   :20px;
    color       :rgba(111, 111, 111, 0);
    border      :1px dashed #c0ccda;
    z-index     :2000;
    top         :0;
  }

  .delete2{
    position    :absolute;
    width       :170px;
    height      :170px;
    line-height :170px;
    text-align  :center;
    font-size   :20px;
    color       :rgba(111, 111, 111, 0);
    border      :1px dashed #c0ccda;
    z-index     :2000;
    top         :0;
  }

  .delete:hover{
    color            :#f0f0f0;
    background-color :rgba(111, 111, 111, 0.5);
  }

  .delete2:hover{
    color            :#f0f0f0;
    background-color :rgba(111, 111, 111, 0.5);
  }

  .delete i{
    cursor :pointer;
  }

  .delete2 i{
    cursor :pointer;
  }

  .el-tag + .el-tag{
    margin-left :10px;
  }

  .button-new-tag{
    margin-left    :10px;
    height         :32px;
    line-height    :30px;
    padding-top    :0;
    padding-bottom :0;
  }

  .input-new-tag{
    width          :90px;
    margin-left    :10px;
    vertical-align :bottom;
  }

  .title{
    font-size      :16px;
    margin         :10px 0;
    padding-bottom :10px;
    border-bottom  :1px solid #c0ccda;
  }

  .tags{
    color         :#606266;
    background    :#ecf5ff;
    border        :1px solid #dcdfe6;
    cursor        :pointer;
    border-radius :20px;
    text-align    :center;
    font-size     :12px;
    line-height   :36px;
    width         :98px;
    height        :36px;
    display       :inline-block;
    margin        :5px;
  }

  .tags:hover{
    border-color :#409eff;
    color        :#fff;
  }

  .changeTag{
    color            :#fff;
    background-color :#409eff;
    border-color     :#409eff;
  }

  /*去除百度地图左下角logo及版权信息*/
  >>> .anchorBL,
  >>> .anchorTR,
  >>> .BMap_zlHolder{
    display    :none;
    visibility :hidden;
  }
</style>
