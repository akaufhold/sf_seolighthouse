<?php
//declare(strict_types=1);

namespace Stackfactory\SfSeolighthouse\Controller;

use TYPO3\CMS\Core\Site\Entity\SiteLanguage;
use TYPO3\CMS\Core\Utility\GeneralUtility;
use TYPO3\CMS\Core\Page\PageRenderer;
use TYPO3\CMS\Core\Context\Context; 
use TYPO3\CMS\Core\Site\SiteFinder;

/**
 *
 * This file is part of the "SEO Lighthouse Score" Extension for TYPO3 CMS.
 *
 * For the full copyright and license information, please read the
 * LICENSE.txt file that was distributed with this source code.
 *
 * (c) 2021 Andreas Kauhold <info@stackfactory.de>, Stackfactory
 */

/*------------------------- DEBUG --------------------------*/
/*----------------------------------------------------------*/
/*-     \TYPO3\CMS\Core\Utility\DebugUtility::debug();     -*/
/*----------------------------------------------------------*/

/**
 * LighthouseStatisticsController
 */
class LighthouseStatisticsController extends \TYPO3\CMS\Extbase\Mvc\Controller\ActionController
{
    public function __construct(){
        $this->pageSpeedApiUrl = "https://www.googleapis.com/pagespeedonline/v5/runPagespeed?";
    }
    /**
     * lighthouseStatisticsRepository
     * 
     * @var \Stackfactory\SfSeolighthouse\Domain\Repository\LighthouseStatisticsRepository
     */
    protected $lighthouseStatisticsRepository = null;

    /**
     * @param \Stackfactory\SfSeolighthouse\Domain\Repository\LighthouseStatisticsRepository $lighthouseStatisticsRepository
     */
    public function injectLighthouseStatisticsRepository(\Stackfactory\SfSeolighthouse\Domain\Repository\LighthouseStatisticsRepository $lighthouseStatisticsRepository)
    {
        $this->lighthouseStatisticsRepository = $lighthouseStatisticsRepository;
    }

    /**
     * get language id
     * 
     * @return int
     */
    public function getLangId(){
        $context = GeneralUtility::makeInstance(Context::class);
        /** @var TYPO3\CMS\Core\Site\Entity\Site */
        $site = $GLOBALS['TYPO3_REQUEST']->getAttribute('site');
        $langId = $context->getPropertyFromAspect('language', 'id');
        return $langId;
    }

    /**
     * get language iso code
     * 
     * @return string
     */
    public function getLocale(){
        /** @var TYPO3\CMS\Core\Site\Entity\Site */
        $site = $GLOBALS['TYPO3_REQUEST']->getAttribute('site');
        /** @var TYPO3\CMS\Core\Site\Entity\SiteLanguage */
        $langId = $this->getLangId();
        $language = $site->getLanguageById($langId);
        $langCode = $language->getLocale();
        if (str_contains($langCode,".")){
            $langCode = explode(".",$langCode)[0];
        }
        return $langCode;
    }

    /**
     * selected page id
     * 
     * @return int
     */
    public function getSelectedPage(){
        $selectedPage = GeneralUtility::_GP('id');
        if (!$selectedPage)
            $selectedPage = $GLOBALS['TSFE']->id;
        return $selectedPage;
    }

    /**
     * storage pid
     * 
     * @return int
     */
    public function getStoragePid(){
        $configurationManager = GeneralUtility::makeInstance('TYPO3\\CMS\\Extbase\\Configuration\\BackendConfigurationManager');
        $configurationManager->getDefaultBackendStoragePid(); 
        $extbaseFrameworkConfiguration = $configurationManager->getTypoScriptSetup();
        $storagePid = $extbaseFrameworkConfiguration["module."]["tx_sfseolighthouse."]["persistence."]["storagePid"];
        return $storagePid;
    }

    /**
     * page base url
     * 
     * @return string
     */
    public function getBaseUrl(){
        $protocol = ((!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] != 'off') || $_SERVER['SERVER_PORT'] == 443) ? "https://" : "http://";
        $baseUrl = $protocol."/".$_SERVER["HTTP_HOST"];
        return $baseUrl;
    }

    /**
     * lighthouse target page url
     * 
     * @return string
     */
    public function getTargetUrl($locale, $pageurl, $device){
        $this->targetUrl = $this->pageSpeedApiUrl."locale=".$locale."&url=".$pageurl;
        if ($device)
            $this->targetUrl.="&strategy=".$device;
        return $this->targetUrl;
    }

    public function requiredJavascript($locale, $pageurl, $device){
        $pageRenderer = \TYPO3\CMS\Core\Utility\GeneralUtility::makeInstance(\TYPO3\CMS\Core\Page\PageRenderer::class);
        $pageRenderer->addRequireJsConfiguration(
        [
            'paths' => [
                'jquery' => 'sysext/core/Resources/Public/JavaScript/Contrib/jquery/',
                'plupload' => '../typo3conf/ext/your_extension/node_modules/plupload/js/plupload.full.min',
            ],
            'shim' => [
                'deps' => ['jquery'],
                'plupload' => ['exports' => 'plupload'],
            ],
        ]
        );
    }
    
    /**
     * action analyse
     * 
     * @return string|object|null|void
     */
    public function analyseAction()
    {
        $lighthouseStatistics = $this->lighthouseStatisticsRepository->findAll();
        $this->view->assign('lighthouseStatistics', $lighthouseStatistics); 

        $storagePid = $this->getStoragePid();
        $this->view->assign('storagePid', $storagePid);
        /* GET URL PARAMS FOR GENERATING LIGHTHOUSE AJAX GET*/
        $this->locale = $this->getLocale();
        /* GET FE URL OF SELECTED PAGE IN PAGETREE*/
        //$lightHouseGetUrl   = $this->getBaseUrl()."/index.php?id=".$this->getSelectedPage();
        $lightHouseGetUrl   = "https://www.stackfactory.de";

        $ajaxGetUrlDesktop  = $this->getTargetUrl($this->locale,$lightHouseGetUrl,"desktop");
        $ajaxGetUrlMobile  = $this->getTargetUrl($this->locale,$lightHouseGetUrl,"mobile");

        //\TYPO3\CMS\Core\Utility\DebugUtility::debug($ajaxGetUrlMobile); 
        
        $this->view->assign('pageId', $this->getSelectedPage());
        $this->view->assign('ajaxGetUrlDesktop', $ajaxGetUrlDesktop);
        $this->view->assign('ajaxGetUrlMobile', $ajaxGetUrlMobile);
    }

    /**
     * action list
     * 
     * @return string|object|null|void
     */
    public function listAction()
    {
        $lighthouseStatistics = $this->lighthouseStatisticsRepository->findByTarget($this->getSelectedPage());
        $this->view->assign('lighthouseStatistics', $lighthouseStatistics); 
        $this->view->assign('pageId', $this->getSelectedPage());
        //\TYPO3\CMS\Core\Utility\DebugUtility::debug($lighthouseStatistics);  
    }

    /**
     * action show
     * 
     * @param \Stackfactory\SfSeolighthouse\Domain\Model\LighthouseStatistics $lighthouseStatistics
     * @return string|object|null|void
     */
    public function showAction(\Stackfactory\SfSeolighthouse\Domain\Model\LighthouseStatistics $lighthouseStatistics)
    {
        $this->view->assign('lighthouseStatistics', $lighthouseStatistics);
    }

    /**
     * action delete
     * 
     * @param \Stackfactory\SfSeolighthouse\Domain\Model\LighthouseStatistics $lighthouseStatistics
     * @return string|object|null|void
     */
    public function deleteAction(\Stackfactory\SfSeolighthouse\Domain\Model\LighthouseStatistics $lighthouseStatistics)
    {
        if ($GLOBALS['BE_USER']->isAdmin()){
            $this->lighthouseStatisticsRepository->remove($lighthouseStatistics);
            $this->redirect('list');
        }else{
            $this->addFlashMessage('The object was not deleted. Please Login as User with administration rights.', '', \TYPO3\CMS\Core\Messaging\AbstractMessage::WARNING);
        }
    }

    /**
     * action new
     * 
     * @return string|object|null|void
     */
    public function newAction()
    {
    }

    /**
     * action create
     * 
     * @param \Stackfactory\SfSeolighthouse\Domain\Model\LighthouseStatistics $newLighthouseStatistics
     * @return string|object|null|void
     */
    public function createAction(\Stackfactory\SfSeolighthouse\Domain\Model\LighthouseStatistics $newLighthouseStatistics)
    {
        if ($GLOBALS['BE_USER']->isAdmin()){
            $this->lighthouseStatisticsRepository->add($newLighthouseStatistics);
            $this->redirect('list');
        }else{
            $this->addFlashMessage('The object was not created. Please Login as User with administration rights.', '', \TYPO3\CMS\Core\Messaging\AbstractMessage::WARNING);
        }
    }
    
}
